"use client";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TimetableViewToggleProps {
  value: "weekly" | "daily";
  onValueChange: (value: "weekly" | "daily") => void;
}

export const TimetableViewToggle = ({
  value,
  onValueChange,
}: TimetableViewToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onValueChange(val as "weekly" | "daily");
      }}
    >
      <ToggleGroupItem value="weekly" aria-label="Weekly view">
        Weekly
      </ToggleGroupItem>
      <ToggleGroupItem value="daily" aria-label="Daily view">
        Daily
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
