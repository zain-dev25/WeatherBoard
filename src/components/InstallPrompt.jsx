import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check karein agar user pehle dismiss kar chuka hai
    if (localStorage.getItem("pwaPromptDismissed")) return;

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setIsVisible(false);
    localStorage.setItem("pwaPromptDismissed", "true");
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 rounded-xl border border-accent/30 bg-bg-elevated p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-white">Install WeatherBoard</h4>
          <p className="text-xs text-text-secondary mt-1">
            Add to your home screen for quick access and offline mode.
          </p>
        </div>
        <button onClick={handleDismiss} className="text-text-muted hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 min-h-touch rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-muted transition-colors"
        >
          Install App
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 min-h-touch rounded-lg border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}