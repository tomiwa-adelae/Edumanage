"use client";
import { Assignment, Class, useAuth } from "@/store/useAuth";
import React, { useEffect, useState } from "react";
import { PendingApprovalBanner } from "../_components/PendingApprovalBanner";
import { StudentDashboardCard } from "../_components/StudentDashboardCard";
import { ApplicationProgress } from "../_components/ApplicationProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  IconBook,
  IconBrandStackoverflow,
  IconCalendar,
  IconClock,
  IconFileDescription,
  IconUser,
} from "@tabler/icons-react";
import { DashboardOverview } from "../_components/DashboardOverview";
import { DashboardDocuments } from "../_components/DashboardDocuments";
import { DashboardPersonalInformationForm } from "../_components/DashboardPersonalInformationForm";
import { configService } from "@/lib/configs";
import { schoolService } from "@/lib/school";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { DashboardParentInformationForm } from "../_components/DashboardParentInformationForm";
import { DashboardEducationInformationForm } from "../_components/DashboardEducationInformationForm";
import { RejectedApprovalBanner } from "../_components/RejectedApprovalBanner";
import { AccountApprovedModal } from "@/components/AccountApprovalModal";
import { PageHeader } from "@/components/PageHeader";
import { StudentCards } from "../_components/StudentCards";
import { studentService } from "@/lib/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignmentCard } from "../_components/AssignmentCard";
import { Badge } from "@/components/ui/badge";
import { calculateAttendanceStats, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NothingFound } from "@/components/NothingFound";
import { ComingSoon } from "@/components/ComingSoon";

const page = () => {
  const { user } = useAuth();

  const [states, setStates] = useState<any>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [countries, setCountries] = useState<any>([]);
  const [departments, setDepartments] = useState<any>([]);
  const [timelines, setTimelines] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalSchoolDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
  });
  const [documents, setDocuments] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    if (user?.Student?.isApproved && !user.Student.completedOnboarding) {
      setShowApprovalModal(true);
    }
  }, [user]);

  const refreshDocuments = async () => {
    if (!user) return;
    try {
      const [documents, timelines, assignments] = await Promise.all([
        schoolService.getStudentDocuments(user.id, user?.schoolId!),
        schoolService.getStudentTimelines(user.id, user?.schoolId!),
        user.Student.isApproved
          ? studentService.getStudentAssignments(user?.school?.id!, user.id)
          : Promise.resolve([]),
      ]);

      setDocuments(documents);
      setTimelines(timelines);
      setAssignments(assignments);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to refresh documents"
      );
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const [
          states,
          classes,
          countries,
          departments,
          classLevels,
          documents,
          timelines,
          assignments,
          attendances,
        ] = await Promise.all([
          configService.getCategory("STATE"),
          schoolService.getSchoolClasses(user?.school?.schoolID!),
          configService.getCategory("COUNTRY"),
          configService.getCategory("SCHOOL_DEPARTMENT"),
          configService.getCategory("CLASS_LEVEL"),
          schoolService.getStudentDocuments(user.id, user?.schoolId!),
          schoolService.getStudentTimelines(user.id, user?.schoolId!), // 👈 NEW
          user.Student.isApproved
            ? studentService.getStudentAssignments(user?.schoolId!, user?.id)
            : Promise.resolve([]),
          user.Student.isApproved
            ? studentService.getMyAttendances(user?.id, user?.school?.id!)
            : Promise.resolve([]),
        ]);

        setStates(states);
        setClasses(classes);
        setCountries(countries);
        setDepartments(departments);
        setClassLevels(classLevels);
        setDocuments(documents);
        setTimelines(timelines); // 👈 store timeline
        setAssignments(assignments); // 👈 store timeline

        const publicHolidays: any = []; // get from DB or config

        const stats = calculateAttendanceStats(
          attendances || [], // raw attendance array from studentService.getMyAttendances
          user?.school?.academicStartDate!, // required
          user?.school?.academicEndDate!, // optional
          publicHolidays
        );

        setAttendanceStats(stats);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  if (loading) return <Loader />;

  const pendingAssignments = assignments.filter((assignment) => {
    const submission = assignment.assignmentSubmissions?.find(
      (sub) => sub.studentId === user?.Student?.id
    );
    return !submission || (!submission.grade && submission.status !== "GRADED");
  });

  if (user?.Student?.isApproved)
    return (
      <div className="space-y-6">
        {showApprovalModal && (
          <AccountApprovedModal onClose={() => setShowApprovalModal(false)} />
        )}
        <PageHeader
          title={`Welcome back, ${user?.firstName}!`}
          description="Here's what's happening with your studies today."
        />
        <StudentCards
          assignments={pendingAssignments.length}
          attendance={attendanceStats.attendancePercentage}
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconCalendar className="size-4 text-primary" />
                  Today's classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <ComingSoon />
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas
                ullam fuga voluptate. Vero ipsum cupiditate dolorum cumque
                magnam odio asperiores, vitae facere quam doloribus sint quos
                alias distinctio facilis. Tempora quam impedit ex voluptatibus!
                Omnis quae ipsum, suscipit odio assumenda nobis cumque iusto
                maxime! Fugit, deleniti? Tempore iste aliquam temporibus, est
                numquam ratione similique veritatis consequatur alias officia
                cum voluptatibus distinctio eius quos et doloribus. Aspernatur
                ratione, atque eum similique sint dolor ad vero quam quod esse
                quaerat reiciendis iusto eaque, molestias minima soluta iste.
                Dolor illo sunt nam est architecto, delectus voluptates dolorum
                ut numquam, non corporis voluptate. Aspernatur commodi dicta
                itaque rem provident ex perferendis, voluptates ipsam ducimus
                voluptatibus cupiditate temporibus nemo fugit error consequatur.
                Modi ipsa quam molestiae id beatae deserunt neque ipsum totam
                magni et debitis consectetur delectus quis, blanditiis fugit
                ullam consequuntur! Tempore reprehenderit recusandae consectetur
                rem eaque vel aliquid, ducimus aspernatur fugiat impedit
                cupiditate perferendis nam. Optio quod amet, a magni repellat
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFileDescription className="size-4 text-primary" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignments.length === 0 && (
                  <NothingFound message="No assignments found" />
                )}
                {assignments.slice(0, 3).map((assignment, index) => {
                  const submission = assignment.assignmentSubmissions?.find(
                    (s) => s.studentId === user?.Student.id
                  );

                  const hasSubmitted = !!submission;
                  const hasGraded = !!(
                    submission && submission.status === "GRADED"
                  );

                  return (
                    <Card key={index}>
                      <CardContent>
                        <p className="text-base font-medium flex items-center justify-between gap-1">
                          <Link
                            href={`/s/assignments/${
                              assignment.slug || assignment.id
                            }`}
                            className="line-clamp-1 hover:underline hover:text-primary"
                          >
                            {assignment.title}
                          </Link>
                          {hasGraded ? (
                            <Badge variant="success">Graded</Badge>
                          ) : hasSubmitted ? (
                            <Badge variant="default">Submitted</Badge>
                          ) : (
                            <Badge variant="pending">Pending</Badge>
                          )}
                        </p>
                        <p className="text-muted-foreground mt-2.5 text-xs flex items-center justify-between gap-1">
                          {assignment.subject.name}{" "}
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
                {assignments.length > 3 && (
                  <Button variant={"outline"} className="w-full" asChild>
                    <Link href={"/s/assignments"}>View all assignments</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-primary hover:bg-transparent hover:text-primary"
            >
              <Link href={"/s/assignments"}>
                <IconFileDescription className="text-primary" />
                View Assignments
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-green-500 hover:bg-transparent hover:text-green-500"
            >
              <Link href={"/s/grades"}>
                <IconBook className="text-green-500" />
                Check Grades
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-purple-500 hover:bg-transparent hover:text-purple-500"
            >
              <Link href={"/s/timetables"}>
                <IconClock className="text-purple-500" />
                View Timetable
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="w-full justify-start md:justify-center md:py-8 md:flex-col hover:border-orange-500 hover:bg-transparent hover:text-orange-500"
            >
              <Link href={"/s/announcements"}>
                <IconClock className="text-orange-500" />
                Announcements
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  if (user?.Student?.isApproved === false)
    return (
      <div className="space-y-6">
        {user?.Student?.applicationStatus === "pending" && (
          <PendingApprovalBanner />
        )}
        {user?.Student?.applicationStatus === "rejected" && (
          <RejectedApprovalBanner reasons={user?.Student?.rejectionReason} />
        )}
        <StudentDashboardCard
          firstName={user?.firstName}
          lastName={user?.lastName}
          desiredClass={user?.Student?.desiredClass}
          appliedDate={user?.createdAt}
          email={user?.email}
          image={user?.image}
          candidateNumber={user?.Student?.candidateNumber}
          applicationStatus={user?.Student?.applicationStatus}
        />
        <ApplicationProgress documents={documents} />
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <ScrollArea>
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="overview">
                <IconBrandStackoverflow
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Overview
              </TabsTrigger>
              <TabsTrigger value="documents" className="group">
                <IconFileDescription
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Documents
              </TabsTrigger>
              <TabsTrigger value="profile" className="group">
                <IconUser
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                My Profile
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="overview">
            <DashboardOverview
              timelines={timelines}
              documents={documents}
              onTabChange={setActiveTab}
            />
          </TabsContent>
          <TabsContent value="documents">
            <DashboardDocuments
              documents={documents}
              onRefresh={refreshDocuments}
            />
          </TabsContent>
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DashboardPersonalInformationForm
                  states={states.items}
                  classes={classes}
                  countries={countries.items}
                  departments={departments.items}
                />
              </div>
              <div className="grid gap-4">
                <div>
                  <DashboardEducationInformationForm
                    departments={departments.items}
                    classLevels={classLevels.items}
                  />
                  <DashboardParentInformationForm
                    states={states.items}
                    classes={classes}
                    countries={countries.items}
                    departments={departments.items}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
};

export default page;
