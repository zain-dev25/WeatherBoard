import { iconUrl } from "../lib/icon";

function formatDay(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function Forecast({ days }) {
  return (
    <section>
      <h3 className="text-sm text-text-secondary mb-3">5-day forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {days.map((day) => (
          <div
            key={day.date}
            className="rounded-lg border border-border bg-bg-card p-4 flex flex-col items-center text-center"
          >
            <p className="text-xs text-text-secondary">
              {formatDay(day.date)}
            </p>
            <img
              src={iconUrl(day.icon)}
              alt={day.description}
              className="w-12 h-12"
              loading="lazy"
            />
            <p className="text-sm font-medium">
              {day.tempMaxC}°{" "}
              <span className="text-text-muted">/ {day.tempMinC}°</span>
            </p>
            <p className="text-xs text-text-muted capitalize mt-1 line-clamp-1">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}