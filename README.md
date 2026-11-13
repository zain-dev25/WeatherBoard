# WeatherBoard 🌤️

A responsive, installable weather dashboard built with React, Vite, and Tailwind CSS.

## 🚀 Live Demo
**URL:** [Yahan apna Vercel/Netlify link daalein]

## ✨ Features
- **City Search:** Live autocomplete via GeoDB Cities API (300ms debounce).
- **Weather Data:** Current conditions + 5-day forecast via OpenWeatherMap, with Open-Meteo as a fallback.
- **Favourites:** Save up to 5 cities (persisted in localStorage with graceful degradation).
- **PWA:** Installable on desktop/mobile, works offline for the last viewed city.
- **Notifications:** Daily morning reminder using the Web Notifications API.
- **Responsive:** Optimized for 375px, 768px, and 1280px.

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS
- **State Management:** Zustand (Favourites), TanStack Query (Weather)
- **PWA:** `vite-plugin-pwa` (Workbox)
- **APIs:** OpenWeatherMap, Open-Meteo, GeoDB Cities (RapidAPI)

## 💻 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weatherboard.git
   cd weatherboard