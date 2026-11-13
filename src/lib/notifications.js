let currentTimer = null;

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

export async function showWeatherNotification(cityName, temp, description) {
  if (Notification.permission !== "granted") return;

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification("WeatherBoard Daily Reminder", {
      body: `${cityName} is ${temp}°C with ${description}.`,
      icon: "/pwa-192x192.png",
      tag: "daily-weather",
    });
  }
}

export function scheduleDailyNotification(timeStr) {
  // Purana timer clear karein agar mojood hai
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  if (scheduledTime.getTime() <= now.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();
  console.log(`Notification scheduled in ${Math.round(delay / 1000 / 60)} minutes`);

  currentTimer = setTimeout(async () => {
    const lastCityRaw = localStorage.getItem("weatherboard:lastCity");
    const lastWeatherRaw = localStorage.getItem("weatherboard:lastWeather");
    
    if (lastCityRaw && lastWeatherRaw) {
      try {
        const lastCity = JSON.parse(lastCityRaw);
        const lastWeather = JSON.parse(lastWeatherRaw);
        await showWeatherNotification(
          lastCity.name,
          lastWeather.current.tempC,
          lastWeather.current.description
        );
      } catch (e) {
        console.error("Failed to parse weather data for notification");
      }
    }
    
    // Agle din ke liye phir se schedule karein
    scheduleDailyNotification(timeStr);
  }, delay);
}