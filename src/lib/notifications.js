import { storage } from "./storage";

let currentTimer = null;

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

async function deliverNotification(title, body) {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  const options = {
    body,
    icon: "/favicon.png",
    tag: "daily-weather",
  };

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, options);
        return true;
      }
    }

    new Notification(title, options);
    return true;
  } catch (error) {
    console.error("Unable to show notification", error);
    return false;
  }
}

export function showWeatherNotification(cityName, temp, description) {
  return deliverNotification(
    "WeatherBoard Daily Reminder",
    `${cityName} is ${temp}°C with ${description}.`
  );
}

export function showTestNotification() {
  return deliverNotification(
    "WeatherBoard notifications are on",
    "Your browser is ready to show weather reminders."
  );
}

export function scheduleDailyNotification(timeStr) {
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr)) return false;

  try {
    localStorage.setItem("notificationTime", timeStr);
  } catch {
    // Scheduling can still work for the current page if storage is unavailable.
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  if (scheduledTime.getTime() <= now.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();
  currentTimer = setTimeout(async () => {
    const lastCity = storage.get("lastCity");
    const lastWeather = storage.get("lastWeather");

    if (lastCity?.name && lastWeather?.current && lastWeather.cityId === lastCity.id) {
      await showWeatherNotification(
        lastCity.name,
        lastWeather.current.tempC,
        lastWeather.current.description
      );
    } else {
      await deliverNotification(
        "WeatherBoard Daily Reminder",
        "Open WeatherBoard to check today's weather."
      );
    }

    scheduleDailyNotification(timeStr);
  }, delay);

  return true;
}