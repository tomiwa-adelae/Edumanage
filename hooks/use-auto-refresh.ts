"use client";
import { useEffect, useRef } from "react";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { getRefreshToken, setAuthTokens } from "@/lib/utils";

const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
const TEST_INTERVAL = 50 * 1000; // 50s for testing

export function useAutoRefresh({ testing = false } = {}) {
  const { user, clearUser } = useAuth();
  const startedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      // If no user, cleanup and reset started flag
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startedRef.current = false;
      return;
    }

    // Only start once per session/user set
    if (startedRef.current) return;
    startedRef.current = true;

    const doRefresh = async () => {
      try {
        // POST refresh endpoint. Send the stored refresh token (Safari/iOS where
        // cookies are blocked); cookies are still included for other browsers.
        const res = await api.post(
          "/auth/refresh",
          { refreshToken: getRefreshToken() },
          { withCredentials: true }
        );
        if (res?.data?.accessToken)
          setAuthTokens(res.data.accessToken, res.data.refreshToken);
        console.log("🔁 token refreshed via auto-refresh", res?.status);
      } catch (err: any) {
        console.error("❌ refresh failed:", err?.response?.status || err);
        // Clear user and redirect to login
        clearUser();
        if (typeof window !== "undefined") {
          // Force hard navigation so cookies cleared and app resets
          window.location.assign("/");
        }
      }
    };

    // Immediately attempt a refresh to ensure cookies are good
    doRefresh();

    // schedule interval
    const ms = testing ? TEST_INTERVAL : REFRESH_INTERVAL;
    intervalRef.current = window.setInterval(doRefresh, ms);

    // also try refresh once when user comes back to tab
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        doRefresh();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener("visibilitychange", onVisibility);
      startedRef.current = false;
    };
  }, [user, clearUser, testing]);
}
