"use client";
import { DashboardCards } from "@/components/DashboardCards";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/store/useAuth";
import React from "react";
import {
  IconAlertCircle,
  IconBook,
  IconCalendar,
  IconClipboardCheck,
  IconFileDescription,
  IconInfoTriangle,
  IconMessage,
  IconServer2,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { CircleCheckBig } from "lucide-react";

const page = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Upcoming Exams",
      value: "12",
      icon: IconCalendar,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "Next 30 days",
    },
    {
      title: "Results Processed",
      value: "1,248",
      icon: IconClipboardCheck,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "+156 this week",
    },
    {
      title: "Pending Results",
      value: "35",
      icon: IconInfoTriangle,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "Requires attention",
    },
    {
      title: "Question Bank",
      value: "3,450",
      icon: IconFileDescription,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "Active questions",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description={"Manage examinations, results, and assessments"}
      />
      <DashboardCards stats={stats} />
    </div>
  );
};

export default page;
