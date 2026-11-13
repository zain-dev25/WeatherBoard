import { iconUrl } from "../lib/icon";

export function WeatherCard({ city, weather, isStale }) {
  const { current, source } = weather;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-bg-card p-6 md:p-8 shadow-lg">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />

      {isStale && (
        <div className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 backdrop-blur-md">
          Cached data
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {city.name}
            </h2>
            <span className="px-2.5 py-1 rounded-md bg-bg-elevated text-xs font-medium text-text-secondary border border-border">
              {city.countryCode}
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">{city.region}</p>
          
          <div className="mt-6 flex items-end gap-2">
            <h3 className="text-6xl font-bold tracking-tighter text-white">
              {current.tempC}°
            </h3>
            <span className="text-lg text-text-secondary mb-2 font-medium">C</span>
          </div>
          <p className="text-text-secondary text-sm capitalize mt-1 font-medium">
            {current.description} · feels like {current.feelsLikeC}°C
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <img
            src={iconUrl(current.icon)}
            alt={current.description}
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">Humidity</dt>
          <dd className="text-lg font-semibold text-white mt-1">{current.humidity}%</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">Wind</dt>
          <dd className="text-lg font-semibold text-white mt-1">{current.windKph} km/h</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">Source</dt>
          <dd className="text-sm font-medium text-text-secondary mt-1.5">
            {source === "open-meteo" ? "Open-Meteo (Fallback)" : "OpenWeatherMap"}
          </dd>
        </div>
      </div>
    </section>
  );
}