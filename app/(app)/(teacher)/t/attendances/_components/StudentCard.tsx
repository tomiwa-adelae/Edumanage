"use client";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: "present" | "absent" | "late" | null;
  profileImage?: string;
}

interface Props {
  student: Student;
  onChange: (id: string, status: "present" | "absent" | "late") => void;
}

export function StudentCard({ student, onChange }: Props) {
  return (
    <div className="p-4 rounded-md border border-gray-200 hover:border-primary transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.rollNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["present", "late", "absent"] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={student.status === status ? "default" : "outline"}
              className={
                student.status === status
                  ? status === "present"
                    ? "bg-green-600 hover:bg-green-700"
                    : status === "late"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-red-600 hover:bg-red-700"
                  : ""
              }
              onClick={() => onChange(student.id, status)}
            >
              {status === "present" && <Check className="w-4 h-4 mr-1" />}
              {status === "late" && <Clock className="w-4 h-4 mr-1" />}
              {status === "absent" && <X className="w-4 h-4 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
