/**
 * Tactile feedback for the patient PWA.
 *
 * Uses the Vibration API (supported on Android Chrome and installed PWAs).
 * iOS Safari does not expose it, so this is a graceful no-op there — never a
 * crash, never a blocked interaction. Respects a user preference so anyone who
 * dislikes haptics can switch them off.
 */

export type HapticPattern =
  | 'selection'   // tiny tick — tab change, chip select
  | 'light'       // small tap — button press, task tick
  | 'medium'      // firmer tap — primary action
  | 'success'     // celebratory double
  | 'warning'
  | 'error';

const KEY = 'retain_haptics';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  selection: 5,
  light: 9,
  medium: 18,
  success: [12, 40, 20],
  warning: [18, 60, 18],
  error: [26, 55, 26, 55, 26],
};

export const hapticsSupported = (): boolean =>
  typeof navigator !== 'undefined' && typeof (navigator as any).vibrate === 'function';

export const hapticsEnabled = (): boolean => {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; }
};

export const setHapticsEnabled = (on: boolean) => {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
};

export const haptic = (pattern: HapticPattern = 'light') => {
  if (!hapticsEnabled() || !hapticsSupported()) return;
  try { (navigator as any).vibrate(PATTERNS[pattern]); } catch { /* ignore */ }
};
