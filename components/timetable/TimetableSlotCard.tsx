"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { TimetableSlot } from "./TimetableGrid";
import { Badge } from "@/components/ui/badge";

interface TimetableSlotCardProps {
  slot: TimetableSlot;
  className?: string;
}

export const TimetableSlotCard = ({ slot, className }: TimetableSlotCardProps) => {
  const getSlotTypeStyles = () => {
    switch (slot.slotType) {
      case "BREAK":
        return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800";
      case "LUNCH":
        return "bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700";
      case "ASSEMBLY":
        return "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800";
      case "LITERARY_AND_DEBATE":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800";
      case "LONG":
        return "bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700";
      case "REGULAR":
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800";
    }
  };

  const getSlotTypeBadge = () => {
    switch (slot.slotType) {
      case "BREAK":
        return <Badge variant="secondary" className="text-xs">Break</Badge>;
      case "LUNCH":
        return <Badge variant="secondary" className="text-xs">Lunch</Badge>;
      case "ASSEMBLY":
        return <Badge variant="secondary" className="text-xs">Assembly</Badge>;
      case "LITERARY_AND_DEBATE":
        return <Badge variant="secondary" className="text-xs">Literary & Debate</Badge>;
      case "LONG":
        return <Badge variant="secondary" className="text-xs">Long Break</Badge>;
      default:
        return null;
    }
  };

  const isNonRegular = ["BREAK", "LUNCH", "ASSEMBLY", "LITERARY_AND_DEBATE", "LONG"].includes(slot.slotType);

  return (
    <div
      className={cn(
        "h-full rounded-md border p-2 transition-all hover:shadow-sm",
        getSlotTypeStyles(),
        className
      )}
    >
      {isNonRegular ? (
        <div className="flex items-center justify-center h-full">
          {getSlotTypeBadge()}
        </div>
      ) : (
        <div className="space-y-1">
          {slot.subject && (
            <div className="font-semibold text-sm text-blue-700 dark:text-blue-300">
              {slot.subject.name}
            </div>
          )}
          {slot.teacher && (
            <div className="text-xs text-muted-foreground">
              {slot.teacher.firstName} {slot.teacher.lastName}
            </div>
          )}
          {slot.room && (
            <div className="text-xs text-muted-foreground">
              Room: {slot.room}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
