import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Assignment, useAuth } from "@/store/useAuth";
import {
  IconAlertCircle,
  IconCheckbox,
  IconClock,
  IconExclamationCircle,
  IconFileDescription,
  IconTrendingUp,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  assignments: Assignment[];
}

export const AssignmentsCards = ({ assignments }: Props) => {
  const { user } = useAuth();
  const total = assignments.length;
  const pending = assignments.filter(
    (a) =>
      !a.assignmentSubmissions?.some((s) => s.studentId === user?.Student.id)
  ).length;
  const submitted = assignments.filter((a) => {
    const submission = a.assignmentSubmissions?.find(
      (s) => s.studentId === user?.Student.id
    );
    return submission && submission.status !== "GRADED";
  }).length;
  const graded = assignments.filter((a) => {
    const submission = a.assignmentSubmissions?.find(
      (s) => s.studentId === user?.Student.id
    );
    return submission?.status === "GRADED";
  }).length;

  const stats = [
    {
      title: "Total Assignments",
      value: total,
      icon: IconFileDescription,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      title: "Pending",
      value: pending,
      icon: IconAlertCircle,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
    },
    {
      title: "Submitted",
      value: submitted,
      icon: IconFileDescription,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
    {
      title: "Graded",
      value: graded,
      icon: IconFileDescription,
      bgColor: "bg-green-600/20",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
      {stats.map(({ value, title, icon, bgColor, textColor }, index) => {
        const Icon = icon;
        return (
          <Card key={index}>
            <CardContent className="flex items-center justify-between gap-1">
              <div className="space-y-2">
                <CardDescription className="line-clamp-1">
                  {title}
                </CardDescription>
                <CardTitle className={cn("text-3xl", textColor)}>
                  {value}
                </CardTitle>
              </div>
              <div className={cn(`rounded-md p-3`, bgColor)}>
                <Icon className={cn(`h-6 w-6`, textColor)} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
