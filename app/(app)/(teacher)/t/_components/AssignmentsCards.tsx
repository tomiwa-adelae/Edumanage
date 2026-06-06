import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconCheckbox,
  IconClock,
  IconExclamationCircle,
  IconFileDescription,
  IconTrendingUp,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  total: number;
  assignments: number;
  lessonNotes: number;
}

export const AssignmentsCards = ({
  total,
  assignments,
  lessonNotes,
}: Props) => {
  const stats = [
    {
      title: "Total Items",
      value: total,
      icon: IconFileDescription,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      title: "Assignments",
      value: assignments,
      icon: IconFileDescription,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
    },
    {
      title: "Lesson Notes",
      value: lessonNotes,
      icon: IconFileDescription,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
    {
      title: "Pending Reviews",
      value: 0,
      icon: IconFileDescription,
      bgColor: "bg-orange-600/20",
      textColor: "text-orange-600",
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
                  {value}{" "}
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
