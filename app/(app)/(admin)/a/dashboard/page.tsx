"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconBook,
  IconCalendar,
  IconClock,
  IconUser,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { RecentActivityBox } from "../_components/RecentActivityBox";
import { PageHeader } from "@/components/PageHeader";
import { DashboardCards } from "@/components/DashboardCards";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useSchoolClasses, useSchoolStudents } from "@/hooks/useSchoolData";

const page = () => {
  const { user } = useAuth();

  // Use React Query hooks for automatic caching
  const { data: classes = [], isLoading: classesLoading } = useSchoolClasses(
    user?.school?.schoolID || undefined
  );

  const { data: studentsData, isLoading: studentsLoading } = useSchoolStudents(
    user?.schoolId || undefined
  );

  const students = studentsData?.data || [];
  const studentsMeta = studentsData?.meta || null;
  const loading = classesLoading || studentsLoading;

  const stats = [
    {
      title: "Total Students",
      value: `${studentsMeta?.total || students.length || 0}`,
      icon: IconUsers,
      bgColor: "bg-primary",
      textColor: "text-white",
      description: "+12% from last month",
    },
    {
      title: "Active classes",
      value: `${classes?.length}`,
      icon: IconBook,
      bgColor: "bg-green-500/20",
      textColor: "text-green-500",
      description: "+2 new classes",
    },
    {
      title: "Upcoming Events",
      value: "0",
      icon: IconCalendar,
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-500",
      description: "This week",
    },
    {
      title: "Performance",
      value: "100%",
      icon: IconTrendingUp,
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-500",
      description: "+2.4% improvement",
    },
  ];

  const quickActions = [
    {
      title: "Add new Student",
      description: "Register a new student",
      icon: IconUser,
      color: "text-primary",
      bgColor: "bg-primary/10",
      hoverBorder: "hover:border-primary",
      slug: "/a/students/new",
    },
    {
      title: "Create subject",
      description: "Add new subject or class",
      icon: IconBook,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      hoverBorder: "hover:border-green-500",
      slug: "/a/subjects/new",
    },
    {
      title: "Schedule Event",
      description: "Add calendar event",
      icon: IconCalendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      hoverBorder: "hover:border-purple-500",
      slug: "/#",
    },
  ];

  const recentActivities = [
    {
      type: "STUDENT",
      title: "New Student enrollment",
      description: "Tomiwa Adelae enrolled in SS2A",
      time: new Date(),
    },
    {
      type: "ASSIGNMENT",
      title: "Assignment submitted",
      description: "Mathematics homework by Class 9B",
      time: new Date(),
    },
    {
      type: "CALENDAR",
      title: "Schedule updated",
      description: "Physics lab session rescheduled",
      time: new Date(),
    },
    {
      type: "GRADE",
      title: "Grade published",
      description: "English exam results for Grade 11",
      time: new Date(),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Dashboard"}
        description={
          "Welcome back! Here's what's happening at your school today."
        }
      />

      {loading ? <CardsSkeleton count={4} /> : <DashboardCards stats={stats} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="col-span-2">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-start">
                <IconClock className="inline-block mr-1" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 mt-2 relative">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <ComingSoon />
                  {recentActivities.map(
                    ({ time, title, description, type }, index) => (
                      <RecentActivityBox
                        time={time}
                        type={type}
                        title={title}
                        description={description}
                        key={index}
                      />
                    )
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 mt-3">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                quickActions.map(
                  (
                    {
                      icon,
                      title,
                      description,
                      color,
                      bgColor,
                      slug,
                      hoverBorder,
                    },
                    index
                  ) => {
                    const Icon = icon;
                    return (
                      <Link
                        href={slug}
                        key={index}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer rounded-md p-3 border border-transparent transition-colors",
                          bgColor,
                          hoverBorder
                        )}
                      >
                        <div className="rounded-md p-3 bg-white dark:bg-card">
                          <Icon className={cn("h-6 w-6", color)} />
                        </div>
                        <div className="space-y-0">
                          <h4 className="font-medium text-sm">{title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </Link>
                    );
                  }
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
