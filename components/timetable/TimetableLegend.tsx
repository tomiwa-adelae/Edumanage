"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface TimetableLegendProps {
  className?: string;
}

export const TimetableLegend = ({ className }: TimetableLegendProps) => {
  const legendItems = [
    { label: "Regular Classes", color: "bg-blue-200 dark:bg-blue-800" },
    { label: "Lab Sessions", color: "bg-green-200 dark:bg-green-800" },
    { label: "Physical Education", color: "bg-purple-200 dark:bg-purple-800" },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", item.color)} />
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
