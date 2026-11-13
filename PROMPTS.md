# PROMPTS.md - WeatherBoard

**IDE Used:** Cursor (Claude 3.5 Sonnet)

## 1. Project Scaffolding
**Prompt:** "Create a Vite + React + TypeScript app with Tailwind CSS and vite-plugin-pwa. Setup a dark mode premium design system."
**Agent Result:** Scaffolded the project but used default Vite styling.
**My Fix:** I manually updated `tailwind.config.js` with custom colors and breakpoints (375, 768, 1280) as per the PDF requirements.

## 2. City Search (GeoDB)
**Prompt:** "Build a city autocomplete search using RapidAPI GeoDB. Add a 300ms debounce, loading state, no-results state, and network error handling."
**Agent Result:** The agent created a basic fetch but didn't debounce it, causing API rate limits.
**My Fix:** I wrote a custom `useDebounce` hook and added `AbortController` to cancel previous requests when a new key is pressed.

## 3. Weather Fetching & Fallback
**Prompt:** "Fetch current weather and 5-day forecast from OpenWeatherMap. If it fails, fallback to Open-Meteo."
**Agent Result:** The agent tried to render OWM's 3-hourly data directly, resulting in 40 blocks instead of 5 days.
**My Fix:** I wrote a utility to group the 3-hourly data by date, calculate min/max temps, and pick the midday condition icon.

## 4. Favourites & Persistence
**Prompt:** "Create a favourites system capped at 5 cities. Persist to localStorage. Ask for confirmation before removing."
**Agent Result:** Used `localStorage.setItem` directly which crashes in private browsing mode.
**My Fix:** Created a `storage.js` wrapper with a `try/catch` block to gracefully degrade if localStorage is blocked.

## 5. PWA & Offline Mode
**Prompt:** "Setup vite-plugin-pwa. Add a banner when offline."
**Agent Result:** The agent tried to write a complex custom service worker.
**My Fix:** I simplified it to use the built-in Workbox caching in `vite.config.js` and used `navigator.onLine` for the offline banner.

## 6. Notifications
**Prompt:** "Implement daily morning weather notifications using the Notification API and Service Worker. Explain why before prompting the user."
**Agent Result:** The agent directly called `Notification.requestPermission()` on page load, which browsers block.
**My Fix:** I added a custom modal that explains the feature, and only calls the API when the user clicks "Okay".