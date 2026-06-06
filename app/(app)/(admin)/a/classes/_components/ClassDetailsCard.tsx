import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Class } from "@/store/useAuth";
import {
  IconAward,
  IconBook,
  IconCheckbox,
  IconClock,
  IconExclamationCircle,
  IconTrendingUp,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  classDetails: Class;
}

export const ClassDetailsCards = ({ classDetails }: Props) => {
  const stats = [
    {
      title: "Total Students",
      value: `${classDetails?.students?.length}/${classDetails?.capacity}`,
      icon: IconUsers,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      description: `${
        (Number(classDetails.students?.length) /
          Number(classDetails.capacity)) *
        100
      }% capacity`,
    },
    {
      title: "Average Score",
      value: "81.4%",
      icon: IconAward,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "Above school average",
    },
    {
      title: "Attendance Rate",
      value: "98.8%",
      icon: IconUserCheck,
      bgColor: "bg-purple/20",
      textColor: "text-purple",
      description: "Require attention",
    },
    {
      title: "Subjects",
      value: 12,
      icon: IconBook,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Active subjects",
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
