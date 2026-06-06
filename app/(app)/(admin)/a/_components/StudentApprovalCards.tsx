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
  rejectedStudents: number;
}

export const StudentApprovalCards = ({ students, rejectedStudents }: Props) => {
  const stats = [
    {
      title: "Pending review",
      value: students,
      textColor: "text-yellow-500",
    },
    {
      title: "Approved today",
      value: 0,
      textColor: "text-green-500",
    },
    {
      title: "Rejected",
      value: rejectedStudents,
      textColor: "text-red-500",
    },
    {
      title: "Average days to process",
      value: 5,
      textColor: "text-primary",
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
