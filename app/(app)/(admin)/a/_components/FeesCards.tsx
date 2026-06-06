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
  IconTrendingUp,
} from "@tabler/icons-react";
import React from "react";

export const FeesCards = () => {
  const stats = [
    {
      title: "Total Collected",
      value: "₦40,000",
      icon: IconCheckbox,
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      description: "This quarter",
    },
    {
      title: "Pending Amount",
      value: "₦18,000",
      icon: IconClock,
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-500",
      description: "Outstanding",
    },
    {
      title: "Overdue Payments",
      value: 1,
      icon: IconExclamationCircle,
      bgColor: "bg-destructive/20",
      textColor: "text-destructive",
      description: "Require attention",
    },
    {
      title: "Collection Rate",
      value: "87.9%",
      icon: IconTrendingUp,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "This quarter",
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
