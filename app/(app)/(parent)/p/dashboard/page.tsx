"use client";

import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import { Separator } from "@/components/ui/separator";
import { parentService } from "@/lib/parent";
import {
  Assignment,
  ParentChildrenLink,
  Student,
  useAuth,
} from "@/store/useAuth";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChildSelection } from "../_components/ChildSelection";
import { ChildCards } from "../_components/ChildCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBook,
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconMessage,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { calculateAttendanceStats, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { Button } from "@/components/ui/button";
import { NothingFound } from "@/components/NothingFound";

const Page = () => {
  const { user } = useAuth();

  const [children, setChildren] = useState<ParentChildrenLink[]>([]);
  const [child, setChild] = useState<Student | undefined>();
  const [assignments, setAssignments] = useState<Assignment[] | undefined>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();
  const [attendanceStats, setAttendanceStats] = useState({
    totalSchoolDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadingChild, setLoadingChild] = useState(false);

  // ✅ Fetch all children for this parent
  useEffect(() => {
    const fetchChildren = async () => {
      if (!user?.id) return;

      try {
        const res = await parentService.getMyChildren(
          user.id,
          user?.school?.id!
        );
        setChildren(res.children || []);

        // Automatically select the first child
        if (res.children?.length > 0) {
          setSelectedChildId(res.children[0].student?.user?.id);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load children"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedChildId) return;

    setChild(undefined);
    setAssignments([]);
    setAttendanceStats({
      totalSchoolDays: 0,
      presentDays: 0,
      absentDays: 0,
      attendancePercentage: 0,
    });
    const fetchChildDetails = async () => {
      if (!user?.id || !selectedChildId) return;

      setLoadingChild(true);
      try {
        const [child, assignments, attendances] = await Promise.all([
          parentService.getChildDetails(
            user.id,
            selectedChildId,
            user?.school?.id!
          ),
          parentService.getChildAssignments(
            user.id,
            selectedChildId,
            user?.school?.id!
          ),
          parentService.getChildAttendances(
            user?.id,
            selectedChildId,
            user?.school?.id!
          ),
        ]);

        setChild(child);
        setAssignments(assignments);
        const publicHolidays: any = []; // get from DB or config

        const stats = calculateAttendanceStats(
          attendances || [], // raw attendance array from studentService.getMyAttendances
          user?.school?.academicStartDate!, // required
          user?.school?.academicEndDate!, // optional
          publicHolidays
        );

        setAttendanceStats(stats);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load child details"
        );
      } finally {
        setLoadingChild(false);
      }
    };

    fetchChildDetails();
  }, [user?.id, selectedChildId]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track your children's academic progress and stay connected with their education"
        title={`Welcome back, ${user?.firstName}`}
      />
      <Separator />

      <ChildSelection
        children={children}
        onChange={({ childId }) => {
          setSelectedChildId(childId);
        }}
      />

      {loadingChild ? (
        <Loader text="Loading details..." />
      ) : (
        <>
          <ChildCards attendance={attendanceStats.attendancePercentage} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 2xl:gap-4">
            <div className="lg:col-span-3">
              <div className="grid gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <IconClock className="size-4 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Latest updates for {child?.user?.firstName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 relative">
                    <ComingSoon />
                    <div className="flex items-center hover:bg-muted transition-all p-2 rounded-md justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <div className={`rounded-md p-3 bg-primary/10`}>
                          <IconBook className={`size-6 text-primary`} />
                        </div>
                        <div>
                          <p className="text-base font-medium">Mathematics</p>
                          <p className="text-muted-foreground text-sm">
                            Test score: 88%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                    <div className="flex items-center hover:bg-muted transition-all p-2 rounded-md justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <div className={`rounded-md p-3 bg-primary/10`}>
                          <IconBook className={`size-6 text-primary`} />
                        </div>
                        <div>
                          <p className="text-base font-medium">Mathematics</p>
                          <p className="text-muted-foreground text-sm">
                            Test score: 88%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                    <div className="flex items-center hover:bg-muted transition-all p-2 rounded-md justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <div className={`rounded-md p-3 bg-primary/10`}>
                          <IconBook className={`size-6 text-primary`} />
                        </div>
                        <div>
                          <p className="text-base font-medium">Mathematics</p>
                          <p className="text-muted-foreground text-sm">
                            Test score: 88%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                    <div className="flex items-center hover:bg-muted transition-all p-2 rounded-md justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <div className={`rounded-md p-3 bg-primary/10`}>
                          <IconBook className={`size-6 text-primary`} />
                        </div>
                        <div>
                          <p className="text-base font-medium">Mathematics</p>
                          <p className="text-muted-foreground text-sm">
                            Test score: 88%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                    <div className="flex items-center hover:bg-muted transition-all p-2 rounded-md justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <div className={`rounded-md p-3 bg-primary/10`}>
                          <IconBook className={`size-6 text-primary`} />
                        </div>
                        <div>
                          <p className="text-base font-medium">Mathematics</p>
                          <p className="text-muted-foreground text-sm">
                            Test score: 88%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                    <div className="flex items-center hover:bg-muted transition-all p-2 rounded-md justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <div className={`rounded-md p-3 bg-primary/10`}>
                          <IconBook className={`size-6 text-primary`} />
                        </div>
                        <div>
                          <p className="text-base font-medium">Mathematics</p>
                          <p className="text-muted-foreground text-sm">
                            Test score: 88%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconCalendar className="size-4 text-primary" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 relative">
                  <ComingSoon />
                  <Card>
                    <CardContent>
                      <p className="font-medium text-base">
                        Parent-Teacher Conference
                      </p>
                      <div className="text-xs space-y-1 mt-1 text-muted-foreground md:text-sm">
                        <p className="flex items-center justify-start gap-2">
                          <IconCalendar className="size-4" />
                          Date: Oct 25, 2026
                        </p>
                        <p className="flex items-center justify-start gap-2">
                          <IconClock className="size-4" />
                          Date: 02:00PM
                        </p>
                        <Badge variant={"destructive"}>Meeting</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <p className="font-medium text-base">
                        Parent-Teacher Conference
                      </p>
                      <div className="text-xs space-y-1 mt-1 text-muted-foreground md:text-sm">
                        <p className="flex items-center justify-start gap-2">
                          <IconCalendar className="size-4" />
                          Date: Oct 25, 2026
                        </p>
                        <p className="flex items-center justify-start gap-2">
                          <IconClock className="size-4" />
                          Date: 02:00PM
                        </p>
                        <Badge variant={"destructive"}>Meeting</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <p className="font-medium text-base">
                        Parent-Teacher Conference
                      </p>
                      <div className="text-xs space-y-1 mt-1 text-muted-foreground md:text-sm">
                        <p className="flex items-center justify-start gap-2">
                          <IconCalendar className="size-4" />
                          Date: Oct 25, 2026
                        </p>
                        <p className="flex items-center justify-start gap-2">
                          <IconClock className="size-4" />
                          Date: 02:00PM
                        </p>
                        <Badge variant={"destructive"}>Meeting</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments?.slice(0, 3).map((assignment) => {
                const studentId = child?.id;

                const submission = assignment.assignmentSubmissions?.find(
                  (s) => s.studentId === studentId
                );

                const hasSubmitted = !!submission;
                const hasGraded = !!(
                  submission && submission.status === "GRADED"
                );
                return (
                  <Card key={assignment.id}>
                    <CardContent>
                      <div className="flex items-center justify-between gap-2">
                        <Badge>{assignment.subject.name}</Badge>
                        {hasGraded ? (
                          <Badge variant="success">Graded</Badge>
                        ) : hasSubmitted ? (
                          <Badge variant="default">Submitted</Badge>
                        ) : (
                          <Badge variant="pending">Pending</Badge>
                        )}
                      </div>
                      <Link
                        href={`/p/assignments/${
                          assignment.slug || assignment.id
                        }`}
                        className="mt-2 font-medium text-base line-clamp-1 hover:underline hover:text-primary"
                      >
                        {assignment.title}
                      </Link>
                      <p className="text-muted-foreground mt-0.5 flex items-center justify-start gap-2 text-xs">
                        <IconClock className="size-4" />
                        Due: {formatDate(assignment.dueDate)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
            {assignments?.length === 0 && (
              <NothingFound message="No assignments yet" />
            )}
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-primary hover:bg-transparent hover:text-primary"
            >
              <Link href={"/messages"}>
                <IconMessage className="text-primary" />
                Message Teachers
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-green-500 hover:bg-transparent hover:text-green-500"
            >
              <Link href={"/p/fees"}>
                <IconCurrencyDollar className="text-green-500" />
                Pay Fees
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-purple-500 hover:bg-transparent hover:text-purple-500"
            >
              <Link href={"/s/timetables"}>
                <IconBook className="text-purple-500" />
                View Reports
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-orange-500 hover:bg-transparent hover:text-orange-500"
            >
              <Link href={"/p/announcements"}>
                <IconCalendar className="text-orange-500" />
                Book Meeting
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
