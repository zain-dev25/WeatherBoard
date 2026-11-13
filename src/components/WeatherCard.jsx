import { iconUrl } from "../lib/icon";

export function WeatherCard({ city, weather, isStale }) {
  const { current, source } = weather;

  return (
    <section className="rounded-xl border border-border bg-bg-card p-6 relative">
      {isStale && (
        <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Cached data
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-text-secondary text-sm">{city.label}</p>
          <h2 className="text-5xl font-semibold mt-2">{current.tempC}°C</h2>
          <p className="text-text-secondary text-sm capitalize mt-1">
            {current.description} · feels like {current.feelsLikeC}°C
          </p>
        </div>
        <img
          src={iconUrl(current.icon)}
          alt={current.description}
          className="w-20 h-20"
          loading="lazy"
        />
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        <div className="rounded-lg bg-bg-elevated p-3">
          <dt className="text-xs text-text-muted">Humidity</dt>
          <dd className="text-lg font-medium">{current.humidity}%</dd>
        </div>
        <div className="rounded-lg bg-bg-elevated p-3">
          <dt className="text-xs text-text-muted">Wind</dt>
          <dd className="text-lg font-medium">{current.windKph} km/h</dd>
        </div>
        <div className="rounded-lg bg-bg-elevated p-3 col-span-2 sm:col-span-1">
          <dt className="text-xs text-text-muted">Source</dt>
          <dd className="text-sm font-medium capitalize">
            {source === "open-meteo" ? "Open-Meteo (fallback)" : "OpenWeatherMap"}
          </dd>
        </div>
      </dl>
    </section>
  );
}