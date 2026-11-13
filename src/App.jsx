import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { Forecast } from "./components/Forecast";
import { WeatherSkeleton } from "./components/WeatherSkeleton";
import { StarButton } from "./components/StarButton";
import { FavouritesPanel } from "./components/FavouritesPanel";
import { Toast } from "./components/Toast";
import { InstallPrompt } from "./components/InstallPrompt"; // NAYA
import { useWeather } from "./hooks/useWeather";
import { useOnlineStatus } from "./hooks/useOnlineStatus"; // NAYA
import { storage } from "./lib/storage";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(() => storage.get("lastCity", null));
  const [toast, setToast] = useState("");
  
  const isOnline = useOnlineStatus(); // NAYA
  const { data, isLoading, isError, error, refetch } = useWeather(selectedCity);

  function handleCitySelect(city) {
    setSelectedCity(city);
    storage.set("lastCity", city);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c10] text-white selection:bg-accent/30">
      
      {/* OFFLINE BANNER (Naya) */}
      {!isOnline && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center text-sm font-medium text-amber-300 backdrop-blur-md sticky top-0 z-50">
          You are offline. Showing your last viewed city's saved weather.
        </div>
      )}

      <header className={`sticky ${!isOnline ? 'top-[40px]' : 'top-0'} z-40 border-b border-border/40 bg-bg-base/80 backdrop-blur-md px-4 md:px-8 py-4 transition-all`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">WeatherBoard</h1>
          </div>
          <div className="w-full md:max-w-md">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          <FavouritesPanel onSelect={handleCitySelect} currentCityId={selectedCity?.id} />
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {!selectedCity && (
            <div className="text-center py-20">
              {/* ... (welcome state same rahega) ... */}
            </div>
          )}

          {selectedCity && isLoading && <WeatherSkeleton />}

          {selectedCity && isError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
              {/* ... (error state same rahega) ... */}
            </div>
          )}

          {selectedCity && data && (
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -top-3 -right-3 z-20">
                  <StarButton city={selectedCity} onToast={setToast} />
                </div>
                <WeatherCard city={selectedCity} weather={data} isStale={data.isStale} />
              </div>
              <Forecast days={data.forecast} />
            </div>
          )}
        </div>
      </main>

      <InstallPrompt /> {/* NAYA */}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}