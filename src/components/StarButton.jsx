import { useState } from "react";
import { useFavourites, MAX_FAVOURITES } from "../store/favourites";
import { ConfirmDialog } from "./ConfirmDialog";

export function StarButton({ city, onToast }) {
  const { isFavourite, add, remove, cities } = useFavourites();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const active = isFavourite(city.id);

  function handleClick() {
    if (active) {
      setConfirmOpen(true);
      return;
    }
    const res = add(city);
    if (!res.ok) {
      if (res.reason === "max") {
        onToast(`You can save up to ${MAX_FAVOURITES} cities. Remove one first.`);
      } else if (res.reason === "already") {
        onToast("Already in your favourites.");
      }
      return;
    }
    onToast(`${city.name} added to favourites.`);
  }

  return (
    <>
      <button
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? "Remove from favourites" : "Add to favourites"}
        className={`min-w-touch min-h-touch flex items-center justify-center rounded-lg border transition-colors ${
          active
            ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
            : "border-border text-text-secondary hover:text-text-primary hover:bg-bg-card"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove from favourites?"
        message={`"${city.name}" will be removed from your favourites. You can add it again later.`}
        confirmLabel="Remove"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          remove(city.id);
          setConfirmOpen(false);
          onToast(`${city.name} removed from favourites.`);
        }}
      />
    </>
  );
}