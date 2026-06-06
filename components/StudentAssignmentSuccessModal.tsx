"use client";

import React from "react";
import { Button } from "./ui/button";
import { IconCheck, IconFileDescription } from "@tabler/icons-react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/hooks/use-role-redirect";

export const StudentAssignmentSuccessModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleReturn = () => {
    if (!user) return;
    router.push(getDashboardPath(user.role));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-border animate-in fade-in zoom-in duration-200">
        {/* Wrapper with height control */}
        <div className="flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-100/60 to-emerald-100/60 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-8 text-center border-b border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full mb-4">
              <IconCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Assignment Submitted Successfully!
            </h2>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-8 overflow-y-auto custom-scroll flex-1">
            <p className="text-muted-foreground text-center leading-relaxed mb-6">
              Great job! Your assignment has been submitted successfully. You’ll
              be notified once your teacher reviews and grades your work.
            </p>

            {/* Info box */}
            <div className="bg-emerald-100/60 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 rounded-md p-4 mb-6">
              <div className="flex items-start gap-3">
                <IconFileDescription className="w-5 h-5 text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                  You can always view or update your submission before the due
                  date from your dashboard.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleReturn}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white"
              >
                Go to Dashboard
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-foreground hover:text-foreground/80"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted px-6 py-4 text-center border-t border-border">
            <p className="text-xs text-muted-foreground">
              Submitted by{" "}
              <span className="font-medium text-foreground">
                {user?.firstName}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
