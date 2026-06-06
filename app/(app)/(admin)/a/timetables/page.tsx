"use client";
import React, { useState } from "react";
import { IconDownload, IconPlus, IconCopy } from "@tabler/icons-react";
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

// Mock data - Replace with actual API calls
const MOCK_SLOTS: TimetableSlot[] = [
  // Monday
  {
    id: "1",
    day: "Monday",
    startTime: "08:10",
    endTime: "08:45",
    subject: { id: "1", name: "Mathematics" },
    teacher: { id: "1", firstName: "John", lastName: "Smith" },
    room: "101",
    slotType: "REGULAR",
  },
  {
    id: "2",
    day: "Monday",
    startTime: "08:50",
    endTime: "09:30",
    subject: { id: "2", name: "English" },
    teacher: { id: "2", firstName: "Sarah", lastName: "Johnson" },
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
    startTime: "08:10",
    endTime: "08:45",
    subject: { id: "3", name: "Physics" },
    teacher: { id: "3", firstName: "Michael", lastName: "Brown" },
    room: "Lab 1",
    slotType: "REGULAR",
  },
  {
    id: "6",
    day: "Tuesday",
    startTime: "09:32",
    endTime: "10:15",
    slotType: "LITERARY_AND_DEBATE",
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
];

const MOCK_CLASSES = [
  { id: "1", name: "JS1 - A" },
  { id: "2", name: "JS1 - B" },
  { id: "3", name: "JS2 - A" },
  { id: "4", name: "JS2 - B" },
];

const TimetablesPage = () => {
  const [viewType, setViewType] = useState<"weekly" | "daily">("weekly");
  const [selectedClass, setSelectedClass] = useState<string>("1");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  const handleCopyTimetable = () => {
    // TODO: Implement copy functionality
    console.log("Copy timetable");
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export PDF");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetables"
        description="Manage class schedules and time slots"
        primaryCTA={{
          label: "Create Timetable",
          slug: "/a/timetables/new",
          icon: IconPlus,
        }}
        secondaryCTA={{
          label: "Export PDF",
          slug: "#",
          icon: IconDownload,
        }}
      />

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-[200px]">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_CLASSES.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyTimetable}>
            <IconCopy className="mr-2 h-4 w-4" />
            Copy Timetable
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <IconDownload className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Legend */}
      <TimetableLegend />

      {/* Timetable Grid */}
      <div className="bg-card border rounded-lg p-4">
        <TimetableGrid
          slots={MOCK_SLOTS}
          viewType={viewType}
          selectedDay={viewType === "daily" ? selectedDay : undefined}
        />
      </div>
    </div>
  );
};

export default TimetablesPage;
