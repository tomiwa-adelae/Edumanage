import { Badge } from "@/components/ui/badge";
import { IconFileDescription } from "@tabler/icons-react";
import React from "react";

export const PendingTask = () => {
  return (
    <div className="border rounded-md px-3 py-4 space-y-2.5 flex items-start justify-start gap-1.5">
      <div className="rounded-md p-3 bg-muted">
        <IconFileDescription className="" />
      </div>
      <div>
        <p className="font-medium text-sm md:text-base">
          JSS3-B Morning Attendance
        </p>
        <p className="text-xs md:text-sm text-muted-foreground flex items-center justify-start gap-1.5">
          <Badge variant={"destructive"}>High</Badge>1 items
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">Due: Today</p>
      </div>
    </div>
  );
};
