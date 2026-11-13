export function CitySuggestions({
  results,
  isLoading,
  error,
  hasSearched,
  query,
  onSelect,
}) {
  const trimmed = query.trim();

  if (trimmed.length < 2) return null;

  if (isLoading) {
    return (
      <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-bg-elevated shadow-xl p-4">
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
          Searching cities…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="absolute z-20 mt-2 w-full rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
      >
        {error}
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-bg-elevated p-3 text-sm text-text-secondary">
        No cities match "{trimmed}". Try a different spelling or a bigger city nearby.
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <ul
      role="listbox"
      className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-lg border border-border bg-bg-elevated shadow-xl"
    >
      {results.map((city) => (
        <li key={city.id}>
          <button
            type="button"
            role="option"
            aria-selected="false"
            onClick={() => onSelect(city)}
            className="w-full min-h-touch text-left px-4 py-3 hover:bg-bg-card focus:bg-bg-card focus:outline-none border-b border-border last:border-b-0 transition-colors"
          >
            <div className="text-sm font-medium text-text-primary">
              {city.name}
            </div>
            <div className="text-xs text-text-secondary">
              {[city.region, city.country].filter(Boolean).join(" · ")}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}