import { useState } from "react";
import {
  requestNotificationPermission,
  scheduleDailyNotification,
  showTestNotification,
} from "../lib/notifications";

export function NotificationSettings() {
  const [permission, setPermission] = useState(() =>
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );
  const [time, setTime] = useState(localStorage.getItem("notificationTime") || "08:00");
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  async function handleEnableClick() {
    setFeedback("");
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result === "granted") {
        scheduleDailyNotification(time);
        setFeedback("Daily reminder enabled.");
      }
    } catch {
      setFeedback("Could not enable notifications. Check your browser settings and try again.");
    }
  }

  function handleTimeChange(e) {
    const newTime = e.target.value;
    setTime(newTime);
    localStorage.setItem("notificationTime", newTime);
    if (permission === "granted") {
      scheduleDailyNotification(newTime);
      setFeedback("Reminder time saved.");
    }
  }

  async function handleTestNotification() {
    setIsTesting(true);
    setFeedback("");
    const shown = await showTestNotification();
    setFeedback(shown ? "Test notification sent." : "Notification could not be shown. Check browser permissions.");
    setIsTesting(false);
  }

  if (permission === "unsupported") {
    return (
      <div className="text-xs text-text-muted">
        Notifications are not supported in this browser.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Notification settings"
        className="flex items-center gap-2 min-h-touch px-3 py-2 rounded-lg text-sm border border-border bg-bg-card hover:bg-bg-elevated transition-colors"
        title="Notification settings"
      >
        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="hidden md:inline">Reminders</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-bg-elevated p-5 shadow-2xl">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Daily weather reminder</h3>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">A quick forecast reminder at a time that works for you.</p>
            </div>
          </div>

          {permission === "granted" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-text-primary">Notifications enabled</span>
              </div>
              <div>
                <label htmlFor="reminder-time" className="mb-1.5 block text-xs font-medium text-text-secondary">Reminder time</label>
                <input
                  id="reminder-time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="w-full min-h-touch rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={handleTestNotification}
                disabled={isTesting}
                className="w-full min-h-touch rounded-lg border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-base disabled:cursor-wait disabled:opacity-60"
              >
                {isTesting ? "Sending test..." : "Send test notification"}
              </button>
              <p className="text-[11px] leading-relaxed text-text-muted">Keep WeatherBoard open for scheduled reminders.</p>
            </div>
          ) : permission === "denied" ? (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-text-secondary">
              Notifications are blocked by your browser. Allow them in this site’s browser settings, then reload WeatherBoard.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-text-secondary">
                Turn on browser notifications to receive a daily weather reminder.
              </p>
              <button
                onClick={handleEnableClick}
                className="w-full min-h-touch rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-muted"
              >
                Enable notifications
              </button>
            </div>
          )}

          {feedback && <p role="status" className="mt-3 text-xs text-text-secondary">{feedback}</p>}
        </div>
      )}
    </div>
  );
}