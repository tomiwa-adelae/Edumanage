import { env } from "@/lib/env";
import { IconAlertCircle, IconClock } from "@tabler/icons-react";
import React from "react";

interface Props {
  reasons?: string | null;
}
export const RejectedApprovalBanner = ({ reasons }: Props) => {
  return (
    <div className="flex items-start justify-start gap-2 rounded-md border border-red-500 bg-red-400/10 px-3 py-4">
      <IconAlertCircle className="size-5 text-red-600 mt-1" />
      <div>
        <p className="font-medium text-base text-red-600">
          Your account has been rejected
        </p>
        <p className="text-sm">
          Your application has been rejected by the school's admin.{" "}
          {reasons && <span className="font-medium">Reason: {reasons}.</span>}{" "}
          Kindly contact your school's support at{" "}
          <a
            className="hover:underline font-medium hover:text-red-600"
            href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}`}
          >
            {env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}
          </a>
        </p>
      </div>
    </div>
  );
};
