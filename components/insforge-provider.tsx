"use client";
import { useEffect } from "react";
import {
  InsforgeBrowserProvider,
  type InitialAuthState,
} from "@insforge/nextjs";
import { insforge } from "@/lib/insforge-client";

export function InsforgeProvider({ 
  children, 
  initialAuth 
}: { 
  children: React.ReactNode, 
  initialAuth?: InitialAuthState 
}) {
  useEffect(() => {
    // Sync localStorage session to cookies for server-side auth support
    const syncSession = () => {
      try {
        const session = localStorage.getItem('insforge-session');
        if (session) {
          // Set a session cookie that the server can read
          // We use the same name as the localStorage key for consistency
          document.cookie = `insforge-session=${encodeURIComponent(session)}; path=/; samesite=lax`;
        }
      } catch (e) {
        console.error('[InsforgeProvider] Session sync failed:', e);
      }
    };

    syncSession();
    // Re-sync on storage changes
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  return (
    <InsforgeBrowserProvider 
      client={insforge} 
      initialAuth={initialAuth}
      afterSignInUrl="/"
    >
      {children}
    </InsforgeBrowserProvider>
  );
}
