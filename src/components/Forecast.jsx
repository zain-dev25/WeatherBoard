import { iconUrl } from "../lib/icon";

function formatDay(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function Forecast({ days }) {
  return (
    <section className="mt-8">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {days.map((day) => (
          <div
            key={day.date}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-bg-card p-4 flex flex-col items-center text-center transition-all hover:bg-bg-elevated hover:border-border"
          >
            <p className="text-xs font-medium text-text-secondary uppercase">
              {formatDay(day.date)}
            </p>
            <img
              src={iconUrl(day.icon)}
              alt={day.description}
              className="w-12 h-12 my-2 transition-transform group-hover:scale-110"
              loading="lazy"
            />
            <p className="text-base font-semibold text-text-primary">
              {day.tempMaxC}° <span className="text-text-muted text-sm font-normal">/ {day.tempMinC}°</span>
            </p>
            <p className="text-[11px] text-text-muted capitalize mt-1 line-clamp-1">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}