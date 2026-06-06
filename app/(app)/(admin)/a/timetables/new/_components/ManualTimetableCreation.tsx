"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconTrash, IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  day: string;
  subjectId: string;
  teacherId: string;
  room: string;
  slotType: "REGULAR" | "BREAK" | "LUNCH" | "ASSEMBLY" | "LITERARY_AND_DEBATE" | "LONG";
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SLOT_TYPES = [
  { value: "REGULAR", label: "Regular Class" },
  { value: "BREAK", label: "Break" },
  { value: "LUNCH", label: "Lunch" },
  { value: "ASSEMBLY", label: "Assembly" },
  { value: "LITERARY_AND_DEBATE", label: "Literary & Debate" },
  { value: "LONG", label: "Long Break" },
];

// Mock data - Replace with API calls
const MOCK_CLASSES = [
  { id: "1", name: "JSS 1A" },
  { id: "2", name: "JSS 1B" },
  { id: "3", name: "JSS 2A" },
];

const MOCK_SUBJECTS = [
  { id: "1", name: "Mathematics" },
  { id: "2", name: "English" },
  { id: "3", name: "Physics" },
  { id: "4", name: "Chemistry" },
  { id: "5", name: "Biology" },
];

const MOCK_TEACHERS = [
  { id: "1", name: "Mr. John Smith" },
  { id: "2", name: "Mrs. Sarah Johnson" },
  { id: "3", name: "Dr. Michael Brown" },
];

export const ManualTimetableCreation = () => {
  const [timetableName, setTimetableName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentDay, setCurrentDay] = useState("Monday");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    startTime: "08:00",
    endTime: "08:40",
    slotType: "REGULAR",
    day: "Monday",
  });

  const handleAddSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      const slot: TimeSlot = {
        id: Math.random().toString(36).substr(2, 9),
        startTime: newSlot.startTime!,
        endTime: newSlot.endTime!,
        day: currentDay,
        subjectId: newSlot.subjectId || "",
        teacherId: newSlot.teacherId || "",
        room: newSlot.room || "",
        slotType: newSlot.slotType as TimeSlot["slotType"] || "REGULAR",
      };
      setSlots([...slots, slot]);
      // Reset new slot
      setNewSlot({
        startTime: newSlot.endTime,
        endTime: "",
        slotType: "REGULAR",
        day: currentDay,
      });
    }
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter((slot) => slot.id !== id));
  };

  const getSlotsForDay = (day: string) => {
    return slots.filter((slot) => slot.day === day).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  };

  const isNonRegularSlot = (slotType: string) => {
    return ["BREAK", "LUNCH", "ASSEMBLY", "LITERARY_AND_DEBATE", "LONG"].includes(slotType);
  };

  const handleSubmit = () => {
    // TODO: Implement API call to save timetable
    console.log({
      name: timetableName,
      classId: selectedClass,
      slots,
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timetable-name">Timetable Name</Label>
          <Input
            id="timetable-name"
            placeholder="e.g., 2024/2025 First Term"
            value={timetableName}
            onChange={(e) => setTimetableName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger id="class">
              <SelectValue placeholder="Select class" />
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
      </div>

      <Separator />

      {/* Day Selector */}
      <div className="space-y-2">
        <Label>Select Day</Label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <Button
              key={day}
              variant={currentDay === day ? "default" : "outline"}
              onClick={() => setCurrentDay(day)}
              className="flex-1 min-w-[100px]"
            >
              {day}
              {getSlotsForDay(day).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getSlotsForDay(day).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Add New Slot Section */}
      <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Add Time Slot for {currentDay}</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-type">Slot Type</Label>
            <Select
              value={newSlot.slotType}
              onValueChange={(value) => setNewSlot({ ...newSlot, slotType: value as TimeSlot["slotType"] })}
            >
              <SelectTrigger id="slot-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SLOT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isNonRegularSlot(newSlot.slotType || "REGULAR") && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={newSlot.subjectId}
                onValueChange={(value) => setNewSlot({ ...newSlot, subjectId: value })}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SUBJECTS.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <Select
                value={newSlot.teacherId}
                onValueChange={(value) => setNewSlot({ ...newSlot, teacherId: value })}
              >
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TEACHERS.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="e.g., Lab 1"
                value={newSlot.room}
                onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
              />
            </div>
          </div>
        )}

        <Button onClick={handleAddSlot} className="w-full">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Slot
        </Button>
      </div>

      {/* Slots List for Current Day */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Slots for {currentDay}</h3>
          <Badge variant="outline">{getSlotsForDay(currentDay).length} slots</Badge>
        </div>

        <ScrollArea className="h-[400px] border rounded-lg">
          <div className="p-4 space-y-2">
            {getSlotsForDay(currentDay).length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No slots added for {currentDay} yet
              </div>
            ) : (
              getSlotsForDay(currentDay).map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "flex items-start gap-3 p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow",
                    isNonRegularSlot(slot.slotType) && "bg-amber-50 dark:bg-amber-950/20"
                  )}
                >
                  <IconGripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <Badge variant={isNonRegularSlot(slot.slotType) ? "secondary" : "default"}>
                        {SLOT_TYPES.find(t => t.value === slot.slotType)?.label}
                      </Badge>
                    </div>
                    {!isNonRegularSlot(slot.slotType) && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          Subject: {MOCK_SUBJECTS.find(s => s.id === slot.subjectId)?.name || "N/A"}
                        </div>
                        <div>
                          Teacher: {MOCK_TEACHERS.find(t => t.id === slot.teacherId)?.name || "N/A"}
                        </div>
                        {slot.room && <div>Room: {slot.room}</div>}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-semibold mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {DAYS.map((day) => (
            <div key={day}>
              <span className="text-muted-foreground">{day}:</span>{" "}
              <span className="font-medium">{getSlotsForDay(day).length} slots</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="font-medium">
            Total Slots: <span className="text-primary">{slots.length}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Save as Draft</Button>
        <Button onClick={handleSubmit} disabled={!timetableName || !selectedClass || slots.length === 0}>
          Create Timetable
        </Button>
      </div>
    </div>
  );
};
