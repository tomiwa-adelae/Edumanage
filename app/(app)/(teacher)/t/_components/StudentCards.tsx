import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  students: number;
}

export const StudentCards = ({ students }: Props) => {
  const stats = [
    {
      title: "Total Students",
      value: `${students}`,
      textColor: "text-black dark:text-white",
    },
    {
      title: "Active Students",
      value: `${students}`,
      textColor: "text-green-500",
    },
    {
      title: "Inactive Students",
      value: "0",
      textColor: "text-gray-700 dark:text-gray-200",
    },
    {
      title: "Suspended",
      value: "0",
      textColor: "text-destructive",
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
