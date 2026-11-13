### Step 2 — City Autocomplete
Prompt: "Build a debounced city search using GeoDB RapidAPI with loading,
no-results, and network-error states. Include AbortController to cancel
stale requests."

What the agent got wrong: [jo bhi hua — e.g., missing debounce, no abort,
generic error message]
My fix: ...


### Step 3 — Weather data with fallback
Prompt: "Create a weather API module that tries OpenWeatherMap and falls
back to Open-Meteo on rate-limit. Normalise both responses to one shape.
Group OWM's 3-hourly forecast into daily min/max. Cache last city's weather
in localStorage with TTL."

Agent issue: Initially it tried to render OWM forecast items directly —
would have shown 40 three-hour blocks instead of 5 days. I had it group
by date and pick a midday slot for the condition icon.

### Step 5 — PWA & Offline
Prompt: "Implement PWA install prompt and offline status banner. Use navigator.onLine to detect connection and show a banner. Ensure last city weather stays visible."

Agent Issue: The agent initially tried to use a complex service worker script for offline detection. I simplified it to `navigator.onLine` + VitePWA's automatic service worker caching which is more reliable for this scope.