"use client";
import { DashboardCards } from "@/components/DashboardCards";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/store/useAuth";
import React from "react";
import {
  IconAlertCircle,
  IconBook,
  IconCalendar,
  IconCurrencyDollar,
  IconFileDescription,
  IconInfoTriangle,
  IconMessage,
  IconSchool,
  IconServer2,
  IconTrendingUp,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { CircleCheckBig } from "lucide-react";

const page = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Students",
      value: "99.8%",
      icon: IconUsers,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "+45 this term",
    },
    {
      title: "Avg Performance",
      value: "72%",
      icon: IconSchool,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "+5% improvement",
    },
    {
      title: "Revenue Analysis",
      value: "₦24.5M",
      icon: IconCurrencyDollar,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "This term",
    },
    {
      title: "Report Generated",
      value: "156",
      icon: IconFileDescription,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "This month",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description={"Analytics, insights, and reporting"}
      />
      <DashboardCards stats={stats} />
    </div>
  );
};

export default page;
