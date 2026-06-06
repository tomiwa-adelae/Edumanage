import { Badge } from "@/components/ui/badge";
import { IconClock } from "@tabler/icons-react";
import { Dot } from "lucide-react";
import React from "react";

export const TodaySchedule = () => {
  return (
    <div className="border rounded-md px-3 py-4 space-y-2.5">
      <p className="font-medium text-sm sm:text-base flex items-center justify-start gap-1.5">
        <span>Mathematics</span> <Badge variant={"outline"}>SS2A</Badge>
      </p>
      <div className="space-y-0.5">
        <p className="text-xs md:text-sm text-muted-foreground">
          Quadratic Equations
        </p>
        <div className="flex items-center justify-start text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center justify-start gap-0.5">
            <IconClock className="size-4" />
            9:00AM - 9:45AM
          </span>
          <Dot />
          <span>Room 101</span>
        </div>
      </div>
    </div>
  );
};
