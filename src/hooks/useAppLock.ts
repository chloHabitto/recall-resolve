import { useState, useEffect, useCallback } from 'react';
import { AppLockSettings, DEFAULT_LOCK_SETTINGS, LockTrigger } from '@/types/appLock';

const LOCK_SETTINGS_KEY = 'worthit_lock_settings';
const LAST_ACTIVITY_KEY = 'worthit_last_activity';

// Simple hash function for PIN (in production, use a proper crypto library)
const hashPin = (pin: string): string => {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export function useAppLock() {
  const [settings, setSettings] = useState<AppLockSettings>(() => {
    try {
      const stored = localStorage.getItem(LOCK_SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load lock settings:', e);
    }
    return DEFAULT_LOCK_SETTINGS;
  });

  const [isLocked, setIsLocked] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: AppLockSettings) => {
    setSettings(newSettings);
    localStorage.setItem(LOCK_SETTINGS_KEY, JSON.stringify(newSettings));
  }, []);

  // Enable lock with PIN
  const enableLock = useCallback((pin: string) => {
    const hashedPin = hashPin(pin);
    saveSettings({
      ...settings,
      isEnabled: true,
      pin: hashedPin,
    });
  }, [settings, saveSettings]);

  // Disable lock
  const disableLock = useCallback(() => {
    saveSettings({
      ...DEFAULT_LOCK_SETTINGS,
    });
  }, [saveSettings]);

  // Change PIN
  const changePin = useCallback((newPin: string) => {
    const hashedPin = hashPin(newPin);
    saveSettings({
      ...settings,
      pin: hashedPin,
    });
  }, [settings, saveSettings]);

  // Toggle biometrics
  const toggleBiometrics = useCallback((enabled: boolean) => {
    saveSettings({
      ...settings,
      biometricsEnabled: enabled,
    });
  }, [settings, saveSettings]);

  // Set lock trigger
  const setLockTrigger = useCallback((trigger: LockTrigger) => {
    saveSettings({
      ...settings,
      lockTrigger: trigger,
    });
  }, [settings, saveSettings]);

  // Set inactivity timeout
  const setInactivityTimeout = useCallback((minutes: number) => {
    saveSettings({
      ...settings,
      inactivityTimeout: minutes,
    });
  }, [settings, saveSettings]);

  // Verify PIN
  const verifyPin = useCallback((pin: string): boolean => {
    if (!settings.pin) return false;
    return hashPin(pin) === settings.pin;
  }, [settings.pin]);

  // Unlock the app
  const unlock = useCallback(() => {
    setIsLocked(false);
    setLastActivity(Date.now());
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }, []);

  // Lock the app
  const lock = useCallback(() => {
    if (settings.isEnabled) {
      setIsLocked(true);
    }
  }, [settings.isEnabled]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  }, []);

  // Check if should lock based on settings
  useEffect(() => {
    if (!settings.isEnabled) {
      setIsLocked(false);
      return;
    }

    // Lock on app open
    if (settings.lockTrigger === 'on_open') {
      // Check if this is a fresh session
      const storedActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (!storedActivity) {
        setIsLocked(true);
      }
    }

    // Handle visibility change for background lock
    const handleVisibilityChange = () => {
      if (document.hidden && settings.lockTrigger === 'on_background') {
        // Will lock when app becomes visible again
      } else if (!document.hidden && settings.lockTrigger === 'on_background') {
        setIsLocked(true);
      }
    };

    // Handle inactivity
    let inactivityTimer: NodeJS.Timeout | null = null;
    
    if (settings.lockTrigger === 'after_inactivity') {
      const checkInactivity = () => {
        const now = Date.now();
        const elapsed = (now - lastActivity) / 1000 / 60; // minutes
        if (elapsed >= settings.inactivityTimeout) {
          setIsLocked(true);
        }
      };

      inactivityTimer = setInterval(checkInactivity, 30000); // Check every 30 seconds
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (inactivityTimer) clearInterval(inactivityTimer);
    };
  }, [settings.isEnabled, settings.lockTrigger, settings.inactivityTimeout, lastActivity]);

  // Track activity on user interaction
  useEffect(() => {
    if (!settings.isEnabled || settings.lockTrigger !== 'after_inactivity') return;

    const handleActivity = () => updateActivity();

    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [settings.isEnabled, settings.lockTrigger, updateActivity]);

  return {
    settings,
    isLocked,
    enableLock,
    disableLock,
    changePin,
    toggleBiometrics,
    setLockTrigger,
    setInactivityTimeout,
    verifyPin,
    unlock,
    lock,
    updateActivity,
  };
}
