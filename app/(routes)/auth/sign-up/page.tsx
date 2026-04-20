"use client";

import { SignUp } from "@insforge/nextjs";
import { useEffect, useState } from "react";
import { insforge } from "@/lib/insforge-client";

export default function SignUpPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!(insforge as any).tokenManager.getAccessToken() || !!localStorage.getItem("insforge-session");
      if (hasToken) {
        setIsSignedIn(true);
        window.location.href = "/";
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SignUp signInUrl="/auth/sign-in" />
    </div>
  );
}
