"use client";
import { DashboardCards } from "@/components/DashboardCards";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/store/useAuth";
import React from "react";
import {
  IconAlertCircle,
  IconBook,
  IconCalendar,
  IconInfoTriangle,
  IconMessage,
  IconServer2,
  IconTrendingUp,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { CircleCheckBig } from "lucide-react";

const page = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Books",
      value: "3,450",
      icon: IconBook,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "In catalog",
    },
    {
      title: "Books Borrowed",
      value: "234",
      icon: IconUsersGroup,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "Currently on loan",
    },
    {
      title: "Overdue Books",
      value: "23",
      icon: IconInfoTriangle,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Needs follow-up",
    },
    {
      title: "Active Members",
      value: "1,248",
      icon: IconUserCheck,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "Registered",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description={"System monitoring and technical support"}
      />
      <DashboardCards stats={stats} />
    </div>
  );
};

export default page;
