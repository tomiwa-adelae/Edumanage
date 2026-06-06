import { Progress } from "@/components/ui/progress";
import React from "react";
import { defaultDocuments } from "./DashboardDocuments";

interface Props {
  documents: {
    type: string;
    status: string;
  }[];
}

export const ApplicationProgress = ({ documents }: Props) => {
  // Required documents only
  const requiredDocs = defaultDocuments?.filter((doc) => doc?.required);

  // Uploaded documents that are approved or under-review
  const completedDocs = requiredDocs?.filter((doc) =>
    documents?.some(
      (d) =>
        d?.type === doc?.type &&
        (d?.status === "approved" || d?.status === "under-review")
    )
  );

  const totalRequired = requiredDocs?.length;
  const totalCompleted = completedDocs?.length;

  const percentage =
    totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
  return (
    <div className="rounded-md px-4 py-6 shadow space-y-1.5">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
        <div>
          <p className="font-medium text-base">Application Progress</p>
          <p className="text-sm text-muted-foreground">
            Complete all required documents to expedite your approval
          </p>
        </div>
        <div className="text-right flex items-center justify-between gap-2 md:flex-col md:justify-end">
          <p className="font-medium text-xl">{percentage}%</p>
          <p className="text-xs text-muted-foreground">
            {totalCompleted}/{totalRequired} completed
          </p>
        </div>
      </div>
      <Progress value={percentage} />
    </div>
  );
};
