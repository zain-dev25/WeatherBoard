import { storage } from "../lib/storage";

const OWM_KEY = import.meta.env.VITE_OWM_API_KEY;

const OWM_CURRENT = "https://api.openweathermap.org/data/2.5/weather";
const OWM_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

/* ---------- Normalised shape (both providers map to this) ----------
{
  source: "openweathermap" | "open-meteo",
  current: {
    tempC, feelsLikeC, humidity, windKph, condition, icon, description
  },
  forecast: [
    { date: "YYYY-MM-DD", tempMinC, tempMaxC, condition, icon, description }
  ]
}
------------------------------------------------------------------- */

const CACHE_KEY = "lastWeather";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min

export function getCachedWeather(cityId) {
  const cached = storage.get(CACHE_KEY);
  if (!cached || cached.cityId !== cityId) return null;
  return cached;
}

export function setCachedWeather(cityId, data) {
  storage.set(CACHE_KEY, { cityId, ...data, cachedAt: Date.now() });
}

/* ---------------- OpenWeatherMap ---------------- */

async function fetchOWM(city, signal) {
  if (!OWM_KEY) throw new Error("OWM key missing");

  const params = new URLSearchParams({
    lat: city.latitude,
    lon: city.longitude,
    appid: OWM_KEY,
    units: "metric",
  });

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${OWM_CURRENT}?${params}`, { signal }),
    fetch(`${OWM_FORECAST}?${params}`, { signal }),
  ]);

  if (currentRes.status === 401 || forecastRes.status === 401) {
    throw new Error(
      "Weather API key is invalid or still activating. New OpenWeatherMap keys can take up to an hour."
    );
  }
  if (currentRes.status === 429 || forecastRes.status === 429) {
    throw new Error("RATE_LIMIT");
  }
  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error("OpenWeatherMap is temporarily unavailable.");
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  // group 3-hourly forecast into days, pick min/max + midday condition
  const byDay = {};
  for (const item of forecast.list) {
    const date = item.dt_txt.slice(0, 10);
    const hour = Number(item.dt_txt.slice(11, 13));
    if (!byDay[date]) {
      byDay[date] = { date, items: [] };
    }
    byDay[date].items.push({ ...item, hour });
  }

  const days = Object.values(byDay)
    .slice(0, 5)
    .map((day) => {
      const temps = day.items.map((i) => i.main.temp);
      const midday =
        day.items.find((i) => i.hour >= 12 && i.hour <= 15) || day.items[0];
      return {
        date: day.date,
        tempMinC: Math.round(Math.min(...temps)),
        tempMaxC: Math.round(Math.max(...temps)),
        condition: midday.weather[0].main,
        icon: midday.weather[0].icon,
        description: midday.weather[0].description,
      };
    });

  return {
    source: "openweathermap",
    current: {
      tempC: Math.round(current.main.temp),
      feelsLikeC: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windKph: Math.round(current.wind.speed * 3.6),
      condition: current.weather[0].main,
      icon: current.weather[0].icon,
      description: current.weather[0].description,
    },
    forecast: days,
  };
}

/* ---------------- Open-Meteo fallback ---------------- */

const WMO_MAP = {
  0: { condition: "Clear", icon: "01d", description: "clear sky" },
  1: { condition: "Clouds", icon: "02d", description: "mainly clear" },
  2: { condition: "Clouds", icon: "03d", description: "partly cloudy" },
  3: { condition: "Clouds", icon: "04d", description: "overcast" },
  45: { condition: "Fog", icon: "50d", description: "fog" },
  48: { condition: "Fog", icon: "50d", description: "freezing fog" },
  51: { condition: "Drizzle", icon: "09d", description: "light drizzle" },
  61: { condition: "Rain", icon: "10d", description: "light rain" },
  63: { condition: "Rain", icon: "10d", description: "moderate rain" },
  65: { condition: "Rain", icon: "10d", description: "heavy rain" },
  71: { condition: "Snow", icon: "13d", description: "light snow" },
  73: { condition: "Snow", icon: "13d", description: "moderate snow" },
  75: { condition: "Snow", icon: "13d", description: "heavy snow" },
  80: { condition: "Rain", icon: "09d", description: "rain showers" },
  95: { condition: "Thunderstorm", icon: "11d", description: "thunderstorm" },
};

function wmoToCondition(code) {
  return WMO_MAP[code] || { condition: "Clouds", icon: "03d", description: "cloudy" };
}

async function fetchOpenMeteo(city, signal) {
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5",
    wind_speed_unit: "kmh",
  });

  const res = await fetch(`${OPEN_METEO}?${params}`, { signal });
  if (!res.ok) throw new Error("Open-Meteo is unavailable right now.");

  const data = await res.json();
  const cur = data.current;
  const curCond = wmoToCondition(cur.weather_code);

  const forecast = data.daily.time.map((date, i) => {
    const cond = wmoToCondition(data.daily.weather_code[i]);
    return {
      date,
      tempMinC: Math.round(data.daily.temperature_2m_min[i]),
      tempMaxC: Math.round(data.daily.temperature_2m_max[i]),
      condition: cond.condition,
      icon: cond.icon,
      description: cond.description,
    };
  });

  return {
    source: "open-meteo",
    current: {
      tempC: Math.round(cur.temperature_2m),
      feelsLikeC: Math.round(cur.apparent_temperature),
      humidity: cur.relative_humidity_2m,
      windKph: Math.round(cur.wind_speed_10m),
      condition: curCond.condition,
      icon: curCond.icon,
      description: curCond.description,
    },
    forecast,
  };
}

/* ---------------- Public API ---------------- */

export async function getWeather(city, signal) {
  // 1. try OWM, fallback to Open-Meteo on rate-limit or missing key
  try {
    return await fetchOWM(city, signal);
  } catch (err) {
    if (err.name === "AbortError") throw err;
    const shouldFallback =
      err.message === "RATE_LIMIT" || err.message === "OWM key missing";
    if (!shouldFallback) {
      // OWM failed for another reason — try Open-Meteo as last resort
      try {
        return await fetchOpenMeteo(city, signal);
      } catch {
        throw err;
      }
    }
    return fetchOpenMeteo(city, signal);
  }
}

export { CACHE_TTL_MS };