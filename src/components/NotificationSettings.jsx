import { useState, useEffect } from "react";
import { requestNotificationPermission, scheduleDailyNotification } from "../lib/notifications";

export function NotificationSettings() {
  const [permission, setPermission] = useState("default");
  const [time, setTime] = useState(localStorage.getItem("notificationTime") || "08:00");
  const [isOpen, setIsOpen] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("unsupported");
    }
  }, []);

  async function handleEnableClick() {
    // Pehle explain karo, phir browser prompt trigger karo
    setIsExplaining(true);
  }

  async function handleConfirmPermission() {
    const result = await requestNotificationPermission();
    setPermission(result);
    setIsExplaining(false);
    
    if (result === "granted") {
      scheduleDailyNotification(time);
    }
  }

  function handleTimeChange(e) {
    const newTime = e.target.value;
    setTime(newTime);
    if (permission === "granted") {
      scheduleDailyNotification(newTime);
    }
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-h-touch px-3 py-2 rounded-lg text-sm border border-border bg-bg-card hover:bg-bg-elevated transition-colors"
        title="Notification Settings"
      >
        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="hidden md:inline">Reminders</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-border bg-bg-elevated p-4 shadow-2xl">
          <h4 className="text-sm font-semibold mb-2">Daily Weather Reminder</h4>
          
          {permission === "granted" ? (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">Your daily reminder is active.</p>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Reminder Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="w-full rounded-md bg-bg-card border border-border px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          ) : permission === "denied" ? (
            <p className="text-xs text-red-400 mt-2">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">
                Get a daily morning notification to check the weather before you start your day.
              </p>
              <button
                onClick={handleEnableClick}
                className="w-full min-h-touch rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-muted transition-colors"
              >
                Enable Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Explain Before Prompt Modal */}
      {isExplaining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-bg-elevated p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">Why Notifications?</h3>
            <p className="text-sm text-text-secondary mt-2">
              WeatherBoard wants to send you a daily reminder about the weather. Your browser will now ask for permission.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setIsExplaining(false)} className="px-4 py-2 text-sm border border-border rounded-lg">Cancel</button>
              <button onClick={handleConfirmPermission} className="px-4 py-2 text-sm bg-accent text-white rounded-lg">Okay, ask me</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}