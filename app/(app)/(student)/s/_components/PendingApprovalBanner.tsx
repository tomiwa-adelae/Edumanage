import { IconClock } from "@tabler/icons-react";
import React from "react";

export const PendingApprovalBanner = () => {
  return (
    <div className="flex items-start justify-start gap-2 rounded-md border border-yellow-500 bg-yellow-400/10 px-3 py-4">
      <IconClock className="size-5 text-yellow-600 mt-1" />
      <div>
        <p className="font-medium text-base text-yellow-600">
          Your account is Pending Approval
        </p>
        <p className="text-sm">
          Your application is currently under review. Please ensure all required
          documents are uploaded. We'll notify you via email once your account
          is approved.
        </p>
      </div>
    </div>
  );
};
