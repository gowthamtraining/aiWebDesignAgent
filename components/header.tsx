"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, useAuth, UserButton } from "@insforge/nextjs";
import { Spinner } from "./ui/spinner";
import { DarkModeToggle } from "./dark-mode-toggle";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { insforge } from "@/lib/insforge-client";

const Header = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn: sdkIsSignedIn } = useAuth();
  const [manualIsSignedIn, setManualIsSignedIn] = useState(false);

  // Sync manual state with SDK and localStorage
  useEffect(() => {
    const checkAuth = () => {
      const hasToken =
        !!(insforge as any).tokenManager.getAccessToken() ||
        !!localStorage.getItem("insforge-session");
      setManualIsSignedIn(hasToken);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000); // Poll for changes
    return () => clearInterval(interval);
  }, []);
  console.log(manualIsSignedIn);

  const isSignedIn = sdkIsSignedIn || manualIsSignedIn;

  const isProjectPage = pathname.startsWith("/project/");

  return (
    <header className="w-full">
      <div
        className={cn(
          `w-full flex py-3.5 px-8
         items-center justify-between
         `,
          isProjectPage && "absolute top-0 z-50 px-2 py-1 right-0 w-auto",
        )}
      >
        <div>{!isProjectPage && <Logo />}</div>

        <div className="flex items-center justify-end gap-3">
          <DarkModeToggle />

          {!manualIsSignedIn ? (
            <>
              <Link href="/auth/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Sign up</Button>
              </Link>
            </>
          ) : (
            <UserButton mode="simple" afterSignOutUrl="/" showProfile />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
