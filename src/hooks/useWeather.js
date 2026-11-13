import { useQuery } from "@tanstack/react-query";
import { getWeather, getCachedWeather, setCachedWeather, CACHE_TTL_MS } from "../api/weather";

export function useWeather(city) {
  return useQuery({
    queryKey: ["weather", city?.id],
    queryFn: async ({ signal }) => {
      if (!city) return null;

      try {
        const data = await getWeather(city, signal);
        setCachedWeather(city.id, data);
        return data;
      } catch (err) {
        // on failure, fall back to cached data if fresh-ish
        const cached = getCachedWeather(city.id);
        if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS * 4) {
          return { ...cached, isStale: true };
        }
        throw err;
      }
    },
    enabled: !!city,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}