export type LockTrigger = 'on_open' | 'on_background' | 'after_inactivity';

export interface AppLockSettings {
  isEnabled: boolean;
  pin: string | null; // Stored as hashed value
  biometricsEnabled: boolean;
  lockTrigger: LockTrigger;
  inactivityTimeout: number; // in minutes, only used when lockTrigger is 'after_inactivity'
}

export const DEFAULT_LOCK_SETTINGS: AppLockSettings = {
  isEnabled: false,
  pin: null,
  biometricsEnabled: false,
  lockTrigger: 'on_open',
  inactivityTimeout: 5,
};
