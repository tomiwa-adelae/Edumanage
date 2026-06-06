import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  total: number;
  active: number;
  teachers: number;
  onLeave: number;
}

export const StaffCards = ({ total, active, teachers, onLeave }: Props) => {
  const stats = [
    {
      title: "Total Staffs",
      value: total,
      textColor: "text-black dark:text-white",
    },
    {
      title: "Active Staffs",
      value: active,
      textColor: "text-green-500",
    },
    {
      title: "Teachers",
      value: teachers,
      textColor: "text-primary",
    },
    {
      title: "On Leave",
      value: onLeave,
      textColor: "text-orange-500",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
      {stats.map(({ value, title, textColor }, index) => {
        return (
          <Card key={index}>
            <CardContent className="flex flex-col text-center items-center justify-center gap-1">
              <CardTitle className={cn("text-3xl", textColor)}>
                {value}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {title}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
