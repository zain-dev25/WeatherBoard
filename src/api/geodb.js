const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const BASE_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

export async function searchCities(query, signal) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  if (!RAPIDAPI_KEY) {
    throw new Error(
      "City search is not configured. Missing API key."
    );
  }

  const url = `${BASE_URL}?namePrefix=${encodeURIComponent(
    query.trim()
  )}&limit=8&sort=-population`;

  let response;
  try {
    response = await fetch(url, {
      signal,
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error(
      "Can't reach the city search service. Check your internet connection."
    );
  }

  if (response.status === 429) {
    throw new Error(
      "Too many searches right now. Please wait a moment and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      "City search is temporarily unavailable. Please try again shortly."
    );
  }

  const data = await response.json();
  return (data.data || []).map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    countryCode: city.countryCode,
    region: city.region,
    latitude: city.latitude,
    longitude: city.longitude,
    label: [city.name, city.region, city.country].filter(Boolean).join(", "),
  }));
}