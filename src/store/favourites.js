import { create } from "zustand";
import { storage } from "../lib/storage";

const MAX_FAVOURITES = 5;
const STORAGE_KEY = "favourites";

const initial = storage.get(STORAGE_KEY, []);

export const useFavourites = create((set, get) => ({
  cities: Array.isArray(initial) ? initial.slice(0, MAX_FAVOURITES) : [],
  storageAvailable: storage.isAvailable,

  isFavourite: (cityId) => get().cities.some((c) => c.id === cityId),

  add: (city) => {
    const { cities } = get();
    if (cities.some((c) => c.id === city.id)) {
      return { ok: false, reason: "already" };
    }
    if (cities.length >= MAX_FAVOURITES) {
      return { ok: false, reason: "max" };
    }
    const next = [...cities, city];
    set({ cities: next });
    storage.set(STORAGE_KEY, next);
    return { ok: true };
  },

  remove: (cityId) => {
    const next = get().cities.filter((c) => c.id !== cityId);
    set({ cities: next });
    storage.set(STORAGE_KEY, next);
  },
}));

export { MAX_FAVOURITES };