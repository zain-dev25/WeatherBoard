import { useEffect, useState } from "react";
import { searchCities } from "../api/geodb";
import { useDebounce } from "./useDebounce";

export function useCitySearch(query) {
  const debouncedQuery = useDebounce(query, 300);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    searchCities(trimmed, controller.signal)
      .then((cities) => {
        setResults(cities);
        setHasSearched(true);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Something unexpected happened.");
        setResults([]);
        setHasSearched(true);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return { results, isLoading, error, hasSearched };
}