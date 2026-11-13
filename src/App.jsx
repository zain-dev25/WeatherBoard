import { useState } from "react";
import { SearchBar } from "./components/SearchBar";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <h1 className="text-lg font-semibold whitespace-nowrap">WeatherBoard</h1>
        <div className="w-full md:ml-auto md:max-w-xl">
          <SearchBar onCitySelect={setSelectedCity} />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        {selectedCity ? (
          <div className="rounded-lg border border-border bg-bg-card p-6">
            <p className="text-text-secondary text-sm">Selected city</p>
            <h2 className="text-2xl font-semibold mt-1">{selectedCity.label}</h2>
            <p className="text-xs text-text-muted mt-2">
              lat: {selectedCity.latitude}, lon: {selectedCity.longitude}
            </p>
            <p className="mt-4 text-sm text-text-secondary">
              Weather data fetching coming in next step ⏭️
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-bg-card p-6 max-w-lg">
            <p className="text-text-secondary text-sm">
              Start by searching for a city above. Suggestions appear as you type.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}