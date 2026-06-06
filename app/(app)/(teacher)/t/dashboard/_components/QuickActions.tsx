import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconAlertCircle,
  IconBookUpload,
  IconFileDescription,
  IconMessage,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export const QuickActions = () => {
  const quickActions = [
    {
      action: "Mark Attendances",
      icon: IconUsers,
      color: "text-primary",
      slug: "/t/attendances",
    },
    {
      action: "Enter Grades",
      icon: IconBookUpload,
      color: "text-green-500",
      slug: "/t/grades",
    },
    {
      action: "Create Assignment",
      icon: IconFileDescription,
      color: "text-purple-500",
      slug: "/t/assignments",
    },
    {
      action: "Record Behavior",
      icon: IconAlertCircle,
      color: "text-orange-500",
      slug: "/t/grades",
    },
    {
      action: "Send message",
      icon: IconMessage,
      color: "text-green-500",
      slug: "/t/grades",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {quickActions.map(({ icon, action, color, slug }, index) => {
          const Icon = icon;
          return (
            <Link
              href={slug}
              key={index}
              className="font-medium text-sm border cursor-pointer hover:bg-muted transition-all rounded-md p-3 flex sm:flex-col text-center items-center justify-start sm:justify-center gap-2"
            >
              <Icon className={cn("size-4", color)} />
              {action}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};
