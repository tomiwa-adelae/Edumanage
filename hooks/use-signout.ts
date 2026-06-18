"use client";

import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearAuthCookie, getRefreshToken } from "@/lib/utils";

export const useSignout = () => {
  const router = useRouter();

  const handleSignout = async function signout() {
    try {
      const res = await api.post("/auth/logout", {
        refreshToken: getRefreshToken(),
      });
      localStorage.removeItem("currentRole");
      toast.success(res.data.message);
    } catch {
      toast.error("Oops! Failed to logout");
    } finally {
      clearAuthCookie();
      useAuth.getState().clearUser();
      localStorage.removeItem("lastVisitedPath"); // 🔹 clear last page
      router.push("/?logout=true");
    }
  };

  return handleSignout;
};
