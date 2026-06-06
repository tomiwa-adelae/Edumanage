"use client";
import React, { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import {
  TimetableGrid,
  TimetableLegend,
  TimetableViewToggle,
  TimetableSlot,
} from "@/components/timetable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Mock data for teacher's timetable - Replace with actual API calls
const MOCK_TEACHER_SLOTS: TimetableSlot[] = [
  // Monday
  {
    id: "1",
    day: "Monday",
    startTime: "08:10",
    endTime: "08:45",
    subject: { id: "1", name: "Mathematics" },
    teacher: { id: "1", firstName: "Current", lastName: "Teacher" },
    room: "101",
    slotType: "REGULAR",
  },
  {
    id: "2",
    day: "Monday",
    startTime: "09:32",
    endTime: "10:15",
    subject: { id: "1", name: "Mathematics" },
    teacher: { id: "1", firstName: "Current", lastName: "Teacher" },
    room: "102",
    slotType: "REGULAR",
  },
  {
    id: "3",
    day: "Monday",
    startTime: "10:15",
    endTime: "10:32",
    slotType: "BREAK",
  },
  {
    id: "4",
    day: "Monday",
    startTime: "12:45",
    endTime: "13:30",
    slotType: "LUNCH",
  },
  // Tuesday
  {
    id: "5",
    day: "Tuesday",
    startTime: "08:50",
    endTime: "09:30",
    subject: { id: "1", name: "Mathematics" },
    teacher: { id: "1", firstName: "Current", lastName: "Teacher" },
    room: "101",
    slotType: "REGULAR",
  },
  {
    id: "7",
    day: "Tuesday",
    startTime: "10:15",
    endTime: "10:32",
    slotType: "BREAK",
  },
  {
    id: "8",
    day: "Tuesday",
    startTime: "12:45",
    endTime: "13:30",
    slotType: "LUNCH",
  },
  // Wednesday
  {
    id: "9",
    day: "Wednesday",
    startTime: "08:10",
    endTime: "08:45",
    subject: { id: "1", name: "Mathematics" },
    teacher: { id: "1", firstName: "Current", lastName: "Teacher" },
    room: "103",
    slotType: "REGULAR",
  },
  {
    id: "10",
    day: "Wednesday",
    startTime: "10:15",
    endTime: "10:32",
    slotType: "BREAK",
  },
  {
    id: "11",
    day: "Wednesday",
    startTime: "12:45",
    endTime: "13:30",
    slotType: "LUNCH",
  },
];

const TimetablesPage = () => {
  const [viewType, setViewType] = useState<"weekly" | "daily">("weekly");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export PDF");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        description="View your teaching schedule"
        secondaryCTA={{
          label: "Export PDF",
          slug: "#",
          icon: IconDownload,
        }}
      />

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TimetableViewToggle value={viewType} onValueChange={setViewType} />

          {viewType === "daily" && (
            <div className="w-full sm:w-[150px]">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                    (day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <IconDownload className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Legend */}
      <TimetableLegend />

      {/* Timetable Grid */}
      <div className="bg-card border rounded-lg p-4">
        <TimetableGrid
          slots={MOCK_TEACHER_SLOTS}
          viewType={viewType}
          selectedDay={viewType === "daily" ? selectedDay : undefined}
        />
      </div>
    </div>
  );
};

export default TimetablesPage;
