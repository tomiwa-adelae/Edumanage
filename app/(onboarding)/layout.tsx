"use client";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { PageGradient } from "../(auth)/_components/PageGradient";
import { useRoleRedirect } from "@/hooks/use-role-redirect";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  useRoleRedirect(user);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const unauthenticated = params.get("unauthenticated");
      const logout = params.get("logout");

      if (unauthenticated === "true") {
        toast.error("Your session has expired. Please log in again.");
      }

      if (logout === "true") {
        toast.success("You've been logged out successfully.");
      }
    }
  }, []);

  return (
    <div className="relative">
      <PageGradient />
      <div className="container flex items-center justify-center min-h-screen py-16">
        {children}
      </div>
    </div>
  );
}
