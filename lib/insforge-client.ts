import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
  auth: {
    persistSession: true,
    storageKey: 'insforge-session'
  },
  debug: true
});

// Persistence wrapper for localStorage
if (typeof window !== 'undefined') {
  const SESSION_KEY = 'insforge-session';

  // 1. Initial Restore
  try {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      // @ts-ignore - access internal token manager
      insforge.tokenManager.saveSession(session);
      // @ts-ignore - access internal http client
      insforge.http.setAuthToken(session.accessToken);
      console.log('[InsForge] Restored session from localStorage');
    }
  } catch (e) {
    console.error('[InsForge] Failed to restore session:', e);
  }

  // 2. Subscribe to changes
  // @ts-ignore
  const originalSave = insforge.tokenManager.saveSession.bind(insforge.tokenManager);
  // @ts-ignore
  insforge.tokenManager.saveSession = (session: any) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    originalSave(session);
  };

  // @ts-ignore
  const originalClear = insforge.tokenManager.clearSession.bind(insforge.tokenManager);
  // @ts-ignore
  insforge.tokenManager.clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    originalClear();
  };
}