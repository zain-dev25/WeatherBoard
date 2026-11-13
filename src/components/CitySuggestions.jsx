export function CitySuggestions({ results, isLoading, error, hasSearched, query, onSelect }) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  const baseClass = "absolute z-50 mt-2 w-full rounded-xl border border-border/80 bg-white dark:bg-black backdrop-blur-xl shadow-2xl overflow-hidden";

  if (isLoading) {
    return (
      <div className={`${baseClass} p-4`}>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
          Searching cities...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${baseClass} p-4 border-red-500/30 bg-red-500/10`}>
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className={`${baseClass} p-4`}>
        <p className="text-sm text-text-secondary">
          No cities match "<span className="text-text-primary">{trimmed}</span>". Try a different spelling.
        </p>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <ul className={`${baseClass} max-h-80 overflow-y-auto`}>
      {results.map((city) => (
        <li key={city.id}>
          <button
            type="button"
            onClick={() => onSelect(city)}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors border-b border-border/50 last:border-0 flex flex-col"
          >
            <div className="text-sm font-medium text-text-primary">{city.name}</div>
            <div className="text-xs text-text-secondary mt-0.5">
              {[city.region, city.country].filter(Boolean).join(" · ")}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}