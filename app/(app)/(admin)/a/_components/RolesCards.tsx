import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconLock,
  IconRestore,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  total: number;
}

export const RolesCards = ({ total }: Props) => {
  const stats = [
    {
      title: "Total Users",
      value: total,
      icon: IconUsers,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      description: "All roles combined",
    },
    {
      title: "Active Roles",
      value: "9",
      icon: IconShield,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "Roles type defined",
    },
    {
      title: "Permission Groups",
      value: 1,
      icon: IconLock,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Access Categories",
    },
    {
      title: "Recent Changes",
      value: "0",
      icon: IconRestore,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "Last 7 days",
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
