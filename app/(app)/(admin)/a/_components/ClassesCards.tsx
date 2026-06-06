import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconBook,
  IconSchool,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  classes: number | undefined;
}

export const ClassesCards = ({ classes }: Props) => {
  const stats = [
    {
      title: "Total Classes",
      value: classes,
      icon: IconSchool,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      description: "Across all levels",
    },
    {
      title: "Total Students",
      value: 3,
      icon: IconUsersGroup,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "Enrolled students",
    },
    {
      title: "Average Class Size",
      value: 7,
      icon: IconUsers,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "Students per class",
    },
    {
      title: "Active Classes",
      value: classes,
      icon: IconBook,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Currently active",
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
