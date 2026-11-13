import { useEffect, useRef, useState } from "react";
import { useCitySearch } from "../hooks/useCitySearch";
import { CitySuggestions } from "./CitySuggestions";

export function SearchBar({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const { results, isLoading, error, hasSearched } = useCitySearch(query);

  // close dropdown on outside click
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

  function handleBlur() {
    setTouched(true);
  }

  function handleFocus() {
    if (trimmed.length >= 2) setOpen(true);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <label htmlFor="city-search" className="sr-only">
        Search for a city
      </label>
      <div className="relative">
        <input
          id="city-search"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search for a city…"
          autoComplete="off"
          aria-invalid={isEmptyError}
          aria-describedby={isEmptyError ? "city-error" : undefined}
          className={`w-full min-h-touch rounded-lg bg-bg-card border px-4 py-3 pr-12 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/60 transition ${
            isEmptyError
              ? "border-red-500/60"
              : "border-border focus:border-border-focus"
          }`}
        />
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
        )}
      </div>

      {isEmptyError && (
        <p id="city-error" className="mt-2 text-xs text-red-400">
          Please enter a city name to see weather.
        </p>
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