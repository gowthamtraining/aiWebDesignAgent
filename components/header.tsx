"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@insforge/nextjs";
import { Spinner } from "./ui/spinner";
import { DarkModeToggle } from "./dark-mode-toggle";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { insforge } from "@/lib/insforge-client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn: sdkIsSignedIn } = useAuth();
  const [manualIsSignedIn, setManualIsSignedIn] = useState(false);

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();
      localStorage.removeItem("insforge-session");
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
      localStorage.removeItem("insforge-session");
      window.location.href = "/auth/sign-in";
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const hasToken =
        !!(insforge as any).tokenManager.getAccessToken() ||
        !!localStorage.getItem("insforge-session");
      setManualIsSignedIn(hasToken);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const isSignedIn = sdkIsSignedIn || manualIsSignedIn;
  const isProjectPage = pathname.startsWith("/project/");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = (insforge as any).auth;
        let userDataResult = null;

        // Try getCurrentUser (Standard method)
        if (typeof auth?.getCurrentUser === "function") {
          const { data } = await auth.getCurrentUser();
          if (data) userDataResult = data;
        } 
        // Try getUser (Alternative name)
        else if (typeof auth?.getUser === "function") {
          const { data } = await auth.getUser();
          if (data?.user) userDataResult = data.user;
          else if (data) userDataResult = data;
        }

        if (userDataResult) {
          setUserData(userDataResult);
          return;
        }

        // Fallback to localStorage session data
        const savedSession = localStorage.getItem("insforge-session");
        if (savedSession) {
          try {
            const session = JSON.parse(savedSession);
            if (session.user) {
              setUserData(session.user);
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error("[Header] User data fetch failed:", err);
      }
    };

    if (isSignedIn) {
      fetchUser();
    } else {
      setUserData(null);
    }
  }, [isSignedIn]);

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

          {!isLoaded ? (
            <Spinner className="w-8 h-8" />
          ) : !isSignedIn ? (
            <>
              <Link href="/auth/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Sign up</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full border bg-muted overflow-hidden">
                    {userData?.user_metadata?.avatar_url ? (
                      <img src={userData.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="px-2 py-1.5 mb-2">
                   <p className="text-sm font-medium leading-none">{userData?.email?.split('@')[0] || 'User'}</p>
                   <p className="text-xs leading-none text-muted-foreground mt-1">{userData?.email}</p>
                </div>
                <div className="h-px bg-border my-1" />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
