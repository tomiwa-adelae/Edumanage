import { activityIconMap, cn, getRelativeTime } from "@/lib/utils";
import React from "react";

interface Props {
  type: string;
  time: Date;
  title: string;
  description: string;
}

export const RecentActivityBox = ({
  type,
  time,
  title,
  description,
}: Props) => {
  const { icon: Icon, color } =
    activityIconMap[type] || activityIconMap.DEFAULT;

  return (
    <div className="flex items-start justify-start gap-2.5 hover:bg-muted p-2 rounded-md">
      <div className="rounded-md p-3 bg-secondary">
        <Icon className={cn("h-6 w-6", color)} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{getRelativeTime(time)}</p>
      </div>
    </div>
  );
};
