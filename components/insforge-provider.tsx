"use client";
import { useEffect } from "react";
import { InsforgeBrowserProvider } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge-client";

export function InsforgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Sync localStorage session to cookies for server-side auth support
    const syncSession = () => {
      try {
        const session = localStorage.getItem('insforge-session');
        if (session) {
          document.cookie = `insforge-session=${encodeURIComponent(session)}; path=/; samesite=lax`;
        }
      } catch (e) {
        console.error('[InsforgeProvider] Session sync failed:', e);
      }
    };

    syncSession();
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  return (
    <InsforgeBrowserProvider
      client={insforge}
      afterSignInUrl="/"
    >
      {children}
    </InsforgeBrowserProvider>
  );
}
