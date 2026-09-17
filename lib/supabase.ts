import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const IS_REAL = supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder') && supabaseAnonKey.length > 0;

const GOD_EMAIL = (import.meta.env.VITE_GOD_EMAIL || 'god@retain.dental').trim().toLowerCase();
// Fallback passkey used when VITE_GOD_PASSWORD is not set or is empty
const _GOD_PASS_ENV = import.meta.env.VITE_GOD_PASSWORD?.trim() || '';
const GOD_PASS = _GOD_PASS_ENV.length > 0 ? _GOD_PASS_ENV : 'godmode2025!';

let authCallback: ((event: string, session: any) => void) | null = null;
let realClient: SupabaseClient | null = null;

if (IS_REAL) {
  realClient = createClient(supabaseUrl, supabaseAnonKey);
}

function emitAuthEvent(event: string, session: any) {
  if (authCallback) {
    setTimeout(() => authCallback!(event, session), 0);
  }
}

function getGodSession() {
  const stored = localStorage.getItem('retain_god_session');
  if (stored) {
    try { return JSON.parse(stored); } catch { localStorage.removeItem('retain_god_session'); }
  }
  return null;
}

function setGodSession(email: string) {
  const session = {
    user: { id: 'local-god-' + Date.now(), email, user_metadata: { full_name: 'Platform Master' } },
    access_token: 'local-god-token',
    refresh_token: 'local-god-token',
    expires_at: Date.now() + 86400000,
  };
  localStorage.setItem('retain_god_session', JSON.stringify(session));
  return session;
}

function clearGodSession() {
  localStorage.removeItem('retain_god_session');
}

function createMockClient() {
  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        if (GOD_PASS && email.toLowerCase() === GOD_EMAIL && password === GOD_PASS) {
          const session = setGodSession(email);
          emitAuthEvent('SIGNED_IN', session);
          return { data: { session, user: session.user }, error: null };
        }
        return { data: { session: null, user: null }, error: new Error('Invalid credentials or Supabase not configured') };
      },
      signUp: async ({ email, password }: { email: string; password?: string }) => {
        return { data: { session: null, user: null }, error: new Error('Signup not available in mock mode') };
      },
      signOut: async () => {
        clearGodSession();
        emitAuthEvent('SIGNED_OUT', null);
        return { error: null };
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authCallback = callback;
        const s = getGodSession();
        if (s) {
          setTimeout(() => callback('INITIAL_SESSION', s), 0);
        }
        const handler = (e: StorageEvent) => {
          if (e.key === 'retain_god_session') {
            if (e.newValue) {
              try { callback('SIGNED_IN', JSON.parse(e.newValue)); } catch {}
            } else {
              callback('SIGNED_OUT', null);
            }
          }
        };
        window.addEventListener('storage', handler);
        return { data: { subscription: { unsubscribe: () => { authCallback = null; window.removeEventListener('storage', handler); } } } };
      },
      getUser: async () => {
        const s = getGodSession();
        return { data: { user: s?.user || null }, error: null };
      },
      getSession: async () => {
        const s = getGodSession();
        return { data: { session: s }, error: null };
      },
      admin: {
        createUser: async () => ({ data: { user: null }, error: new Error('Admin API not available in mock mode') }),
        deleteUser: async () => ({ data: null, error: new Error('Admin API not available in mock mode') }),
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({
            limit: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  };
}

// Intercept God Mode before delegating to real Supabase
const wrappedClient = realClient
  ? {
      auth: {
        ...realClient!.auth,
        signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
          if (GOD_PASS && email.toLowerCase() === GOD_EMAIL && password === GOD_PASS) {
            const session = setGodSession(email);
            emitAuthEvent('SIGNED_IN', session);
            return { data: { session, user: session.user }, error: null };
          }
          return realClient!.auth.signInWithPassword({ email, password });
        },
        signUp: (credentials: any) => realClient!.auth.signUp(credentials),
        signOut: async () => {
          clearGodSession();
          return realClient!.auth.signOut();
        },
        onAuthStateChange: (callback: (event: string, session: any) => void) => {
          authCallback = callback;
          const godSession = getGodSession();
          if (godSession) {
            setTimeout(() => callback('INITIAL_SESSION', godSession), 0);
          }
          const sub = realClient!.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') clearGodSession();
            callback(event, session);
          });
          return { data: { subscription: { unsubscribe: () => { authCallback = null; sub.data.subscription.unsubscribe(); } } } };
        },
        getSession: async () => {
          const godSession = getGodSession();
          if (godSession) return { data: { session: godSession }, error: null };
          return realClient!.auth.getSession();
        },
        getUser: async () => {
          const godSession = getGodSession();
          if (godSession) return { data: { user: godSession.user }, error: null };
          return realClient!.auth.getUser();
        },
      },
      from: realClient!.from.bind(realClient!),
    }
  : createMockClient();

export const supabase = !IS_REAL ? createMockClient() : wrappedClient;
