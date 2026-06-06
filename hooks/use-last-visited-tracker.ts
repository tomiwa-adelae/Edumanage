"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useLastVisitedTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register")
    ) {
      localStorage.setItem("lastVisitedPath", pathname);
    }
  }, [pathname]);
}
