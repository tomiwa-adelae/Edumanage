import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconBook,
  IconClock,
  IconSchool,
  IconUsersGroup,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  subjects: number;
  departments: number;
}

export const SubjectsCards = ({ subjects, departments }: Props) => {
  const stats = [
    {
      title: "Total Subjects",
      value: subjects,
      icon: IconBook,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      description: "3 active",
    },
    {
      title: "Departments",
      value: departments,
      icon: IconSchool,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "Grouped by academic departments",
    },
    {
      title: "Teachers Assigned",
      value: 7,
      icon: IconUsersGroup,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "Instructors handling active subjects",
    },
    {
      title: "Weekly Hours",
      value: 20,
      icon: IconClock,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Total instruction time",
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
