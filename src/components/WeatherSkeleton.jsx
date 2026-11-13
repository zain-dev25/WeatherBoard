export function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <div className="h-4 w-24 bg-bg-elevated rounded" />
        <div className="h-10 w-40 bg-bg-elevated rounded mt-4" />
        <div className="h-4 w-32 bg-bg-elevated rounded mt-3" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-lg bg-bg-card border border-border"
          />
        ))}
      </div>
    </div>
  );
}