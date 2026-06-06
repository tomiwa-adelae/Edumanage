"use client";
import React from "react";
import { Button } from "./ui/button";
import { env } from "@/lib/env";
import { IconClock, IconMail } from "@tabler/icons-react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/hooks/use-role-redirect";

export const AccountPendingModal = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleReturn = () => {
    if (!user) return;
    const path = getDashboardPath(user.role);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/5 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow w-full max-h-[70vh] max-w-[90vw] sm:max-w-xl sm:max-h-[min(640px,80vh)] mx-4 flex flex-col overflow-hidden">
        {/* Header with icon */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-8 text-center flex-shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <IconClock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Account Pending Approval
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-8 overflow-y-auto flex-1 dark:bg-muted">
          <p className="text-muted-foreground text-center leading-relaxed mb-6">
            Your account is currently pending approval from your school
            administrator. You'll be able to access this page once your account
            has been approved.
          </p>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
            <div className="flex items-start gap-3">
              <IconMail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-primary">
                You'll receive an email notification once your account has been
                approved by the administrator.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <a href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}`}>
                Contact Administrator
              </a>
            </Button>
            <Button onClick={handleReturn} variant={"ghost"} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted px-6 py-4 text-center border-t border-gray-100 flex-shrink-0">
          <p className="text-xs text-muted-foreground">
            Need help? Contact support at{" "}
            <a
              className="hover:underline hover:text-primary"
              href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}`}
            >
              Contact Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
