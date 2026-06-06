import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconCurrencyDollar,
  IconMessage,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  attendance: number;
}

export const ChildCards = ({ attendance }: Props) => {
  // Determine attendance status
  let attendanceColor = "bg-green-500/20";
  let attendanceTextColor = "text-green-500";
  let attendanceDescription = "This term";

  if (attendance < 75) {
    attendanceColor = "bg-red-500/20";
    attendanceTextColor = "text-red-500";
    attendanceDescription = "Attendance needs improvement";
  } else if (attendance < 90) {
    attendanceColor = "bg-yellow-500/20";
    attendanceTextColor = "text-yellow-500";
    attendanceDescription = "Average attendance";
  } else {
    attendanceDescription = "Excellent attendance";
  }

  const stats = [
    {
      title: "Attendance",
      value: `${attendance}%`,
      icon: IconUsers,
      bgColor: attendanceColor,
      textColor: attendanceTextColor,
      description: attendanceDescription,
    },
    {
      title: "Average Grade",
      value: "85%",
      icon: IconSchool,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "Current term",
    },
    {
      title: "Pending Fees",
      value: "₦20,000",
      icon: IconCurrencyDollar,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "All cleared",
    },
    {
      title: "Messages",
      value: "3",
      icon: IconMessage,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Unread",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
      {stats.map(
        ({ value, title, icon, bgColor, textColor, description }, index) => {
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
                  <p className="text-muted-foreground text-xs line-clamp-1">
                    {description}
                  </p>
                </div>
                <div className={cn(`rounded-md p-3`, bgColor)}>
                  <Icon className={cn(`h-6 w-6`, textColor)} />
                </div>
              </CardContent>
            </Card>
          );
        }
      )}
    </div>
  );
};
