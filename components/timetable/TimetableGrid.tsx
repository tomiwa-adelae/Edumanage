"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { TimetableSlotCard } from "./TimetableSlotCard";

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject?: {
    name: string;
    id: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
    id: string;
  };
  room?: string;
  slotType: "REGULAR" | "BREAK" | "LUNCH" | "ASSEMBLY" | "LITERARY_AND_DEBATE" | "LONG";
}

interface TimetableGridProps {
  slots: TimetableSlot[];
  viewType?: "weekly" | "daily";
  selectedDay?: string;
  className?: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = [
  { start: "08:10", end: "08:45" },
  { start: "08:50", end: "09:30" },
  { start: "09:32", end: "10:15" },
  { start: "10:15", end: "10:32" }, // Break
  { start: "10:50", end: "11:30" },
  { start: "11:30", end: "12:00" },
  { start: "12:00", end: "12:40" },
  { start: "12:45", end: "13:30" }, // Lunch
  { start: "13:30", end: "14:15" },
  { start: "14:15", end: "15:00" },
];

export const TimetableGrid = ({
  slots,
  viewType = "weekly",
  selectedDay,
  className,
}: TimetableGridProps) => {
  const daysToShow = viewType === "daily" && selectedDay ? [selectedDay] : DAYS;

  const getSlotForTime = (day: string, startTime: string) => {
    return slots.find(
      (slot) =>
        slot.day.toUpperCase() === day.toUpperCase() &&
        slot.startTime === startTime
    );
  };

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid gap-0 border-b" style={{
          gridTemplateColumns: `120px repeat(${daysToShow.length}, minmax(150px, 1fr))`
        }}>
          <div className="border-r p-4 bg-muted/50 font-semibold">
            Time
          </div>
          {daysToShow.map((day) => (
            <div
              key={day}
              className="border-r last:border-r-0 p-4 text-center bg-muted/50 font-semibold"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {TIME_SLOTS.map((timeSlot, index) => (
          <div
            key={`${timeSlot.start}-${timeSlot.end}`}
            className="grid gap-0 border-b last:border-b-0"
            style={{
              gridTemplateColumns: `120px repeat(${daysToShow.length}, minmax(150px, 1fr))`
            }}
          >
            <div className="border-r p-4 text-sm font-medium bg-muted/20">
              {timeSlot.start} - {timeSlot.end}
            </div>
            {daysToShow.map((day) => {
              const slot = getSlotForTime(day, timeSlot.start);
              return (
                <div
                  key={`${day}-${timeSlot.start}`}
                  className="border-r last:border-r-0 p-2 min-h-[80px]"
                >
                  {slot ? (
                    <TimetableSlotCard slot={slot} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-xs">

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
