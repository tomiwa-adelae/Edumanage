"use client";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { parentService } from "@/lib/parent";
import {
  Assignment,
  ParentChildrenLink,
  Student,
  useAuth,
} from "@/store/useAuth";
import { Progress } from "@/components/ui/progress";
import { IconBook, IconCalendar, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { calculateAttendanceStats, formatDate } from "@/lib/utils";
import { ComingSoon } from "@/components/ComingSoon";
import { NothingFound } from "@/components/NothingFound";

const Page = () => {
  const { user } = useAuth();

  const [children, setChildren] = useState<ParentChildrenLink[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();
  const [child, setChild] = useState<Student | undefined>();
  const [assignments, setAssignments] = useState<Assignment[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState({
    totalSchoolDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
  });
  const [loadingChild, setLoadingChild] = useState(false);

  // Fetch all children
  useEffect(() => {
    const fetchChildren = async () => {
      if (!user?.id) return;

      try {
        const res = await parentService.getMyChildren(
          user.id,
          user?.school?.id!
        );
        const fetchedChildren = res.children || [];
        setChildren(fetchedChildren);

        // Automatically select the first child
        if (fetchedChildren.length > 0) {
          const firstChildId = fetchedChildren[0].student?.user?.id;
          setSelectedChildId(firstChildId);
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

  // Fetch selected child details
  useEffect(() => {
    setChild(undefined);
    setAssignments([]);
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
        // ✅ Filter only graded ones
        const gradedAssignments = assignments.filter(
          (a: any) =>
            a.assignmentSubmissions &&
            a.assignmentSubmissions.length > 0 &&
            a.assignmentSubmissions[0].status === "GRADED"
        );
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

  if (!children.length)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-3">
        <p className="text-muted-foreground">
          You currently have no linked children.
        </p>
      </div>
    );

  // Determine attendance status colors and description
  const attendancePercentage = attendanceStats.attendancePercentage;

  let attendanceColor = "bg-green-500/20";
  let attendanceTextColor = "text-green-500";
  let attendanceDescription = "Excellent attendance";

  if (attendancePercentage < 75) {
    attendanceColor = "bg-red-500/20";
    attendanceTextColor = "text-red-500";
    attendanceDescription = "Attendance needs improvement";
  } else if (attendancePercentage < 90) {
    attendanceColor = "bg-yellow-500/20";
    attendanceTextColor = "text-yellow-500";
    attendanceDescription = "Average attendance";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Children's Academic Progress"
        description="Track detailed academic performance and progress reports"
      />

      <Tabs
        value={selectedChildId}
        onValueChange={(val) => setSelectedChildId(val)}
      >
        <ScrollArea>
          <TabsList className="mb-3 w-full">
            {children.map((childLink) => {
              const id = childLink.student?.user?.id;
              const name = `${childLink.student?.user?.firstName ?? ""} ${
                childLink.student?.user?.lastName ?? ""
              }`;
              return (
                <TabsTrigger key={id} value={id!}>
                  {name || "Unnamed"}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {loadingChild ? (
          <Loader text="Loading details..." />
        ) : (
          <TabsContent value={selectedChildId ?? ""}>
            <div className="space-y-6">
              <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between gap-1">
                      <div className="space-y-2">
                        <CardTitle className="text-3xl">10%</CardTitle>
                        <p className="text-muted-foreground text-xs line-clamp-1">
                          Overall Average
                        </p>
                      </div>
                      <div className="rounded-md p-3 bg-primary/10">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <Progress value={90} />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between gap-1">
                      <div className="space-y-2">
                        <CardTitle className="text-3xl">
                          {attendanceStats.attendancePercentage}%
                        </CardTitle>
                        <p
                          className={`text-xs line-clamp-1 ${attendanceTextColor}`}
                        >
                          {attendanceDescription}
                        </p>
                      </div>
                      <div className={`rounded-md p-3 ${attendanceColor}`}>
                        <IconCalendar
                          className={`h-6 w-6 ${attendanceTextColor}`}
                        />
                      </div>
                    </div>
                    <Progress
                      value={attendanceStats.attendancePercentage}
                      className={`${attendanceColor}`}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between gap-1">
                      <div className="space-y-2">
                        <CardTitle className="text-3xl">5th</CardTitle>
                        <p className="text-muted-foreground text-xs line-clamp-1">
                          Class Position
                        </p>
                      </div>
                      <div className="rounded-md p-3 bg-purple-500/10">
                        <IconBook className="h-6 w-6 text-purple-500" />
                      </div>
                    </div>
                    <Progress value={90} />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>
                    Current term grades and class positions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 relative">
                  <ComingSoon />
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="rounded-md p-3 bg-primary/10">
                          <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-base">Mathematics</p>
                          <p className="text-sm text-muted-foreground">
                            Position: 3 of 45
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={"success"}>
                            <IconTrendingUp />
                            Improving
                          </Badge>
                          <p className="text-base">88%</p>
                        </div>
                      </div>
                      <Progress value={90} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="rounded-md p-3 bg-primary/10">
                          <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-base">Mathematics</p>
                          <p className="text-sm text-muted-foreground">
                            Position: 3 of 45
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={"success"}>
                            <IconTrendingUp />
                            Improving
                          </Badge>
                          <p className="text-base">88%</p>
                        </div>
                      </div>
                      <Progress value={90} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="rounded-md p-3 bg-primary/10">
                          <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-base">Mathematics</p>
                          <p className="text-sm text-muted-foreground">
                            Position: 3 of 45
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={"success"}>
                            <IconTrendingUp />
                            Improving
                          </Badge>
                          <p className="text-base">88%</p>
                        </div>
                      </div>
                      <Progress value={90} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="rounded-md p-3 bg-primary/10">
                          <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-base">Mathematics</p>
                          <p className="text-sm text-muted-foreground">
                            Position: 3 of 45
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={"success"}>
                            <IconTrendingUp />
                            Improving
                          </Badge>
                          <p className="text-base">88%</p>
                        </div>
                      </div>
                      <Progress value={90} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="rounded-md p-3 bg-primary/10">
                          <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-base">Mathematics</p>
                          <p className="text-sm text-muted-foreground">
                            Position: 3 of 45
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={"success"}>
                            <IconTrendingUp />
                            Improving
                          </Badge>
                          <p className="text-base">88%</p>
                        </div>
                      </div>
                      <Progress value={90} />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Test Scores</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {assignments && assignments.length > 0 ? (
                    // ✅ Process and render only graded submissions for the child
                    assignments
                      .map((assignment) => {
                        const submission =
                          assignment.assignmentSubmissions?.find(
                            (s) =>
                              s.studentId === child?.id && s.status === "GRADED"
                          );

                        if (!submission) return null; // Skip ungraded ones

                        const grade = submission.grade || 0;
                        const total = assignment.totalMarks || 100;
                        const scorePercent = Math.round(
                          (Number(grade) / total) * 100
                        );

                        return (
                          <Card key={assignment.id}>
                            <CardContent className="space-y-2">
                              <Badge>{assignment.subject?.name || "N/A"}</Badge>
                              <p className="text-2xl font-semibold">
                                {grade} / {total}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(submission.gradedAt)}
                              </p>
                              <Progress value={scorePercent} />
                            </CardContent>
                          </Card>
                        );
                      })
                      .filter(Boolean).length > 0 ? (
                      // ✅ Only render graded cards if any exist
                      assignments
                        .map((assignment) => {
                          const submission =
                            assignment.assignmentSubmissions?.find(
                              (s) =>
                                s.studentId === child?.id &&
                                s.status === "GRADED"
                            );

                          if (!submission) return null;

                          const grade = submission.grade || 0;
                          const total = assignment.totalMarks || 100;
                          const scorePercent = Math.round(
                            (Number(grade) / total) * 100
                          );

                          return (
                            <Card key={assignment.id}>
                              <CardContent className="space-y-2">
                                <Badge>
                                  {assignment.subject?.name || "N/A"}
                                </Badge>
                                <p className="text-2xl font-semibold">
                                  {grade} / {total}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(submission.gradedAt)}
                                </p>
                                <Progress value={scorePercent} />
                              </CardContent>
                            </Card>
                          );
                        })
                        .filter(Boolean)
                    ) : (
                      // ✅ No graded submissions
                      <div className="col-span-full">
                        <NothingFound message="No graded test scores found yet." />
                      </div>
                    )
                  ) : (
                    // ✅ No assignments at all
                    <div className="col-span-full">
                      <NothingFound message="No assignments found." />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Page;
