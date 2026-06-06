import { useEffect, useRef } from "react";
import api from "@/lib/api";
import { env } from "@/lib/env";
import { useAuth } from "@/store/useAuth";
import { useSignout } from "./use-signout";
import { toast } from "sonner";

export function useSchoolFetcher() {
  const { user, updateSchool } = useAuth();
  const handleSignout = useSignout();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (!user.schoolId) {
      toast.error("No school found for this account. Please contact support.");
      handleSignout();
      return;
    }

    // ✅ Don’t refetch if school already loaded
    if (user.school || hasFetched.current) return;

    hasFetched.current = true;

    api
      .get(`${env.NEXT_PUBLIC_BACKEND_URL}/schools/${user.schoolId}`)
      .then((res) => {
        updateSchool(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch school:", err);
        handleSignout();
      });
  }, [user, user?.schoolId, user?.school, updateSchool, handleSignout]);
}
