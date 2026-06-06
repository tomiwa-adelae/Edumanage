"use client";
import { DashboardCards } from "@/components/DashboardCards";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/store/useAuth";
import React from "react";
import {
  IconAlertCircle,
  IconBook,
  IconCalendar,
  IconChartInfographic,
  IconCurrencyDollar,
  IconInfoTriangle,
  IconMessage,
  IconServer2,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
  IconWallet,
} from "@tabler/icons-react";
import { CircleCheckBig } from "lucide-react";

const page = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Revenue",
      value: "₦24.5M",
      icon: IconCurrencyDollar,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "+12% from last term",
    },
    {
      title: "Fees Collected",
      value: "₦18.2M",
      icon: IconWallet,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "This term",
    },
    {
      title: "Outstanding Fees",
      value: "₦6.3M",
      icon: IconInfoTriangle,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "152 students",
    },
    {
      title: "Expenses",
      value: "₦8.7M",
      icon: IconChartInfographic,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "This month",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description={"Financial management and fee collection"}
      />
      <DashboardCards stats={stats} />
    </div>
  );
};

export default page;
