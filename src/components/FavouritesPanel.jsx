import { useState } from "react";
import { useFavourites } from "../store/favourites";
import { ConfirmDialog } from "./ConfirmDialog";

export function FavouritesPanel({ onSelect, currentCityId }) {
  const { cities, storageAvailable, remove } = useFavourites();
  const [pendingRemove, setPendingRemove] = useState(null);

  if (!storageAvailable) {
    return (
      <div className="px-4 md:px-8 pb-3 text-xs text-amber-300/90">
        Favourites are disabled — your browser is blocking local storage.
      </div>
    );
  }

  if (cities.length === 0) return null;

  return (
    <>
      <div className="px-4 md:px-8 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {cities.map((city) => {
            const isActive = city.id === currentCityId;
            return (
              <div
                key={city.id}
                className={`group inline-flex items-center rounded-full border text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-border bg-bg-card text-text-secondary hover:text-text-primary"
                }`}
              >
                <button
                  onClick={() => onSelect(city)}
                  className="min-h-touch pl-3 pr-2 py-1"
                >
                  {city.name}
                </button>
                <button
                  onClick={() => setPendingRemove(city)}
                  aria-label={`Remove ${city.name}`}
                  className="min-h-touch pr-2 pl-1 opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingRemove}
        title="Remove from favourites?"
        message={
          pendingRemove
            ? `"${pendingRemove.name}" will be removed from your favourites.`
            : ""
        }
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          remove(pendingRemove.id);
          setPendingRemove(null);
        }}
      />
    </>
  );
}