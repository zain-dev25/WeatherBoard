import { useEffect, useRef, useState } from "react";
import { useCitySearch } from "../hooks/useCitySearch";
import { CitySuggestions } from "./CitySuggestions";

export function SearchBar({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const { results, isLoading, error, hasSearched } = useCitySearch(query);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const trimmed = query.trim();
  const isEmptyError = touched && trimmed.length === 0;

  function handleSelect(city) {
    onCitySelect(city);
    setQuery(city.label);
    setOpen(false);
    setTouched(false);
  }

  function handleChange(e) {
    setQuery(e.target.value);
    setOpen(true);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => trimmed.length >= 2 && setOpen(true)}
          onBlur={() => setTouched(true)}
          placeholder="Search for a city..."
          autoComplete="off"
          className={`w-full min-h-touch rounded-xl bg-bg-elevated/50 border pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-bg-elevated transition-all ${
            isEmptyError ? "border-red-500/50" : "border-border/80 focus:border-accent/50"
          }`}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
          </div>
        )}
      </div>

      {isEmptyError && (
        <p className="mt-2 text-xs text-red-400">Please enter a city name to see weather.</p>
      )}

      {open && (
        <CitySuggestions
          results={results}
          isLoading={isLoading}
          error={error}
          hasSearched={hasSearched}
          query={query}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}