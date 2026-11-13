import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { Forecast } from "./components/Forecast";
import { WeatherSkeleton } from "./components/WeatherSkeleton";
import { useWeather } from "./hooks/useWeather";
import { storage } from "./lib/storage";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(() =>
    storage.get("lastCity", null)
  );

  const { data, isLoading, isError, error, refetch } = useWeather(selectedCity);

  function handleCitySelect(city) {
    setSelectedCity(city);
    storage.set("lastCity", city);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <h1 className="text-lg font-semibold whitespace-nowrap">
          WeatherBoard
        </h1>
        <div className="w-full md:ml-auto md:max-w-xl">
          <SearchBar onCitySelect={handleCitySelect} />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {!selectedCity && (
            <div className="rounded-lg border border-border bg-bg-card p-8 text-center">
              <h2 className="text-xl font-semibold">Welcome 👋</h2>
              <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
                Search for a city to see current conditions and a 5-day
                forecast. Your last viewed city will be remembered.
              </p>
            </div>
          )}

          {selectedCity && isLoading && <WeatherSkeleton />}

          {selectedCity && isError && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-500/10 p-6"
            >
              <h3 className="font-medium text-red-300">
                Couldn't load weather
              </h3>
              <p className="text-sm text-red-200/80 mt-1">
                {error?.message || "Something went wrong while fetching weather."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 min-h-touch px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-sm text-red-200 hover:bg-red-500/30"
              >
                Try again
              </button>
            </div>
          )}

          {selectedCity && data && (
            <>
              <WeatherCard
                city={selectedCity}
                weather={data}
                isStale={data.isStale}
              />
              <Forecast days={data.forecast} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}