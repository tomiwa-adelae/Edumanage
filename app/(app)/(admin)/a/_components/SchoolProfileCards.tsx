"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatWord } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import {
  IconBook,
  IconBuilding,
  IconCalendar,
  IconSchool,
} from "@tabler/icons-react";
import React from "react";

export const SchoolProfileCards = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Established",
      value: user?.school?.establishmentYear,
      icon: IconCalendar,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      title: "Current Session",
      value: user?.school?.currentSession || "Not selected",
      icon: IconSchool,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
    },
    {
      title: "Current Term",
      value: user?.school?.currentTerm || "Not selected",
      icon: IconBook,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
    {
      title: "School Type",
      value: formatWord[user?.school?.schoolType || ""],
      icon: IconBuilding,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
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
                <CardTitle className={cn("text-xl", textColor)}>
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
