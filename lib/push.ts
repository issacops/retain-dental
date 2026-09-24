/**
 * Web Push for the patient PWA — no SMS/WhatsApp provider required.
 *
 * Flow: request permission → subscribe with the VAPID public key → hand the
 * subscription to the backend (saved to `push_subscriptions`). The server-side
 * sender (`/api/send-push`) then delivers notifications even when the app is
 * closed.
 *
 * Notes:
 * - Requires a secure context (HTTPS) and a registered service worker.
 * - On iOS, Web Push only works once the PWA is installed to the Home Screen
 *   (iOS 16.4+); before that the toggle reports "not supported".
 */

export type PushState = 'unsupported' | 'unconfigured' | 'default' | 'granted' | 'denied';

export const VAPID_PUBLIC_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string) || '';

export const isPushSupported = (): boolean =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

export const getPushState = (): PushState => {
  if (!isPushSupported()) return 'unsupported';
  if (!VAPID_PUBLIC_KEY) return 'unconfigured';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return 'default';
};

export const isIOS = (): boolean =>
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const isStandalone = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true);

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
};

export const getExistingSubscription = async (): Promise<PushSubscription | null> => {
  if (!isPushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
};

export interface SerializedSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** Ask permission and subscribe. Throws with a human-readable message. */
export const enablePush = async (): Promise<SerializedSubscription> => {
  if (!isPushSupported()) throw new Error('This device does not support notifications.');
  if (!VAPID_PUBLIC_KEY) throw new Error('Notifications are not configured for this clinic yet.');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notifications were blocked. Enable them for this app in your device settings.');
  }

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const sub = existing || (await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  }));

  return sub.toJSON() as unknown as SerializedSubscription;
};

/** Unsubscribe this device and return its endpoint (for backend cleanup). */
export const disablePush = async (): Promise<string | null> => {
  const sub = await getExistingSubscription();
  if (!sub) return null;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  return endpoint;
};
