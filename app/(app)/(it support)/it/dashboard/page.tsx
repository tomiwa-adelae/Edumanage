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
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { CircleCheckBig } from "lucide-react";

const page = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "System Uptime",
      value: "99.8%",
      icon: CircleCheckBig,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "All systems operational",
    },
    {
      title: "Active Users",
      value: "1,233",
      icon: IconUsersGroup,
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      description: "Currently online",
    },
    {
      title: "Open Tickets",
      value: "13",
      icon: IconInfoTriangle,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "3 high priority",
    },
    {
      title: "Storage Used",
      value: "72%",
      icon: IconServer2,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "2.4TB/3.6TB",
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
