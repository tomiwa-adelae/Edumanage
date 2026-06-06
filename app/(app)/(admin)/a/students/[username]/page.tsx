"use client";
import { DetailsSkeleton } from "@/components/DetailsSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { schoolService } from "@/lib/school";
import {
  calculateAge,
  calculateAttendanceStats,
  cn,
  formatDate,
  formatPhoneNumber,
} from "@/lib/utils";
import { useAuth, User } from "@/store/useAuth";
import {
  IconAward,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconClock,
  IconEye,
  IconMail,
  IconMapPin2,
  IconPencil,
  IconPhone,
  IconSchool,
  IconTrash,
  IconTrendingUp,
  IconUser,
  IconUsers,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ComingSoon } from "@/components/ComingSoon";
import { QuickActions } from "../_components/QuickActions";

const page = () => {
  const { user } = useAuth();

  const { username } = useParams();

  const [student, setStudent] = useState<User>();
  const [loading, setLoading] = useState(true);

  const [attendanceStats, setAttendanceStats] = useState({
    totalSchoolDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      if (!user || !user.school?.id || !username) return;

      try {
        const student = await schoolService.getStudentDetails(
          user?.school?.id!,
          username!
        );

        setStudent(student);
        const publicHolidays: any = []; // get from DB or config

        const stats = calculateAttendanceStats(
          student.Student.Attendance || [], // raw attendance array from studentService.getMyAttendances
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
  }, [user, username]);

  if (loading)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Details"
          description="Loading student information..."
          back
        />
        <DetailsSkeleton sections={8} showAvatar={true} />
      </div>
    );

  if (!student) return notFound();

  const handleRefresh = async () => {
    if (!user || !user.school?.schoolID || !username) return;

    try {
      const student = await schoolService.getStudentDetails(
        user?.school?.id!,
        username!
      );

      setStudent(student);
      const publicHolidays: any = []; // get from DB or config

      const stats = calculateAttendanceStats(
        student.Student.Attendance || [], // raw attendance array from studentService.getMyAttendances
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

  const attendancePercentage = attendanceStats.attendancePercentage;

  let attendanceColor = "bg-green-50";
  let attendanceTextColor = "text-green-600";
  let attendanceDescription = "Excellent attendance record";

  if (attendancePercentage < 75) {
    attendanceColor = "bg-red-50";
    attendanceTextColor = "text-red-600";
    attendanceDescription = "Attendance needs improvement";
  } else if (attendancePercentage < 90) {
    attendanceColor = "bg-yellow-50";
    attendanceTextColor = "text-yellow-600";
    attendanceDescription = "Average attendance record";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Student Details`}
        description={`Complete information about ${student.firstName} ${student.lastName}`}
        secondaryCTA={{
          label: "Edit",
          slug: `/a/students/${student?.username}/edit`,
          icon: IconPencil,
        }}
        back
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="col-span-1 lg:col-span-3">
          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="text-center flex flex-col items-center justify-center gap-4">
                  <UserProfilePicture
                    size="lg"
                    src={student?.image}
                    alt={`${student?.firstName}'s picture`}
                  />
                  <div className="space-y-1.5">
                    <p className="text-base lg:text-lg font-medium">
                      {student.firstName} {student.lastName}{" "}
                      {student?.otherName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {student.Student.admissionNumber}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <Badge
                        variant={
                          student?.Student.isApproved
                            ? "default"
                            : student?.Student.isRejected
                            ? "destructive"
                            : "pending"
                        }
                      >
                        {student?.Student.isApproved
                          ? "Approved"
                          : student?.Student.isRejected
                          ? "Application rejected"
                          : "Pending approval"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4 text-muted-foreground text-sm">
                  <div className="flex items-start justify-start gap-2">
                    <IconSchool className="size-5" />
                    <div>
                      <p className="text-xs">Class</p>
                      <p className="text-black dark:text-white font-medium">
                        {student.Student.Class.level}
                        {student?.Student.Class.section}
                      </p>
                    </div>
                  </div>
                  {student?.Student.Class.level &&
                    ["SS1", "SS2", "SS3"].includes(
                      student?.Student?.Class.level
                    ) && (
                      <div className="flex items-start justify-start gap-2">
                        <IconBuilding className="size-5" />
                        <div>
                          <p className="text-xs">Department</p>
                          <p className="text-black dark:text-white font-medium">
                            {student.department || (
                              <span className="italic">
                                No department selected
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  <div className="flex items-start justify-start gap-2">
                    <IconUser className="size-5" />
                    <div>
                      <p className="text-xs">Gender</p>
                      <p className="text-black dark:text-white font-medium">
                        {student.gender || (
                          <span className="italic">No gender selected</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-start gap-2">
                    <IconCalendar className="size-5" />
                    <div>
                      <p className="text-xs">Date of Birth</p>
                      <p className="text-black dark:text-white font-medium">
                        {`${formatDate(student.dob)} (${calculateAge(
                          student?.dob!
                        )} years)` || (
                          <span className="italic">No Date of Birth</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-start gap-2">
                    <IconAward className="size-5" />
                    <div>
                      <p className="text-xs">Admission Number</p>
                      <p className="text-black dark:text-white font-medium">
                        {student.Student.admissionNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-muted-foreground text-sm">
                <div className="flex items-start justify-start gap-2">
                  <IconMail className="size-5" />
                  <div>
                    <p className="text-xs">Email</p>
                    <p className="text-black dark:text-white font-medium">
                      {student.email ? (
                        <a
                          className="hover:underline hover:text-primary"
                          href={`mailto:${student.email}`}
                        >
                          {student.email}
                        </a>
                      ) : (
                        <span className="italic">No email</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-start gap-2">
                  <IconPhone className="size-5" />
                  <div>
                    <p className="text-xs">Phone</p>
                    <p className="text-black dark:text-white font-medium">
                      {student.phoneNumber ? (
                        <a
                          className="hover:underline hover:text-primary"
                          href={`tel:${student.phoneNumber}`}
                        >
                          {formatPhoneNumber(student.phoneNumber)}
                        </a>
                      ) : (
                        <span className="italic">No phone</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-start gap-2">
                  <IconMapPin2 className="size-5" />
                  <div>
                    <p className="text-xs">Address</p>
                    <p className="text-black dark:text-white font-medium">
                      {student.address ? (
                        <p>
                          {student.address}, {student.city}, {student.state},{" "}
                          {student.country}
                        </p>
                      ) : (
                        <span className="italic">No address</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {student.medicalConditions && (
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  {student.medicalConditions}
                </CardContent>
              </Card>
            )}
            <div className="hidden md:block">
              <QuickActions
                lastName={student?.lastName}
                firstName={student?.firstName}
                image={student?.image}
                email={student?.email}
                role={student?.role}
                username={student?.username}
                studentId={student?.id}
                schoolRoles={student?.schoolRoles}
                onRefresh={() => handleRefresh()}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconUsers className="size-4" />
                  Parents/Guardians Details
                </CardTitle>
              </CardHeader>
              <CardContent
                className={cn(
                  "grid gap-4 grid-cols-1",
                  student.Student.ParentStudentLink.length > 1 &&
                    "lg:grid-cols-2"
                )}
              >
                {student.Student.ParentStudentLink.map((parent, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        {parent.relation}
                        <Badge variant={"secondary"}>{parent.relation}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm grid gap-4">
                      <div>
                        <p className="text-xs">Name</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.title}{" "}
                          {parent.parent.user?.firstName}{" "}
                          {parent.parent.user?.lastName}{" "}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs">Phone</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.phoneNumber ? (
                            <a
                              className="hover:underline hover:text-primary"
                              href={`tel:${parent.parent.user?.phoneNumber}`}
                            >
                              {formatPhoneNumber(
                                parent.parent.user?.phoneNumber
                              )}
                            </a>
                          ) : (
                            <span className="italic">No phone</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs">Phone</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.email ? (
                            <a
                              className="hover:underline hover:text-primary"
                              href={`mailto:${parent.parent.user?.email}`}
                            >
                              {parent.parent.user?.email}
                            </a>
                          ) : (
                            <span className="italic">No email</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs">Occupation</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.occupation ? (
                            parent.parent.user.occupation
                          ) : (
                            <span className="italic">No occupation</span>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconCalendar className="size-4" />
                  Enrollment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm grid grid-cols-1 gap-2 lg:grid-cols-2">
                <div>
                  <p className="text-xs">Admission Date:</p>
                  <p className="text-black dark:text-white font-medium">
                    {formatDate(student.Student.approvalDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs">Current Class:</p>
                  <p className="text-black dark:text-white font-medium">
                    {student.Student.Class.level}
                    {student.Student.Class.section}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconTrendingUp className="size-4" />
                  Academic Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
                  <ComingSoon />
                  <div className="p-4 bg-primary/5 rounded-md">
                    <p className="text-xs text-muted-foreground">Current GPA</p>
                    <p className="text-primary">3.85</p>
                  </div>
                  <div className="p-4 bg-muted/10 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      Previous GPA
                    </p>
                    <p className="text-primary">3.72</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-base">
                    Current Term Performance
                  </p>
                  <div className="grid gap-4 relative">
                    <ComingSoon />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-black dark:text-white">
                          Mathematics
                        </p>
                        <p className="text-muted-foreground flex items-center justify-end gap-2">
                          <span>92%</span> <Badge variant={"outline"}>A</Badge>
                        </p>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-black dark:text-white">
                          Mathematics
                        </p>
                        <p className="text-muted-foreground flex items-center justify-end gap-2">
                          <span>92%</span> <Badge variant={"outline"}>A</Badge>
                        </p>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-black dark:text-white">
                          Mathematics
                        </p>
                        <p className="text-muted-foreground flex items-center justify-end gap-2">
                          <span>92%</span> <Badge variant={"outline"}>A</Badge>
                        </p>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-black dark:text-white">
                          Mathematics
                        </p>
                        <p className="text-muted-foreground flex items-center justify-end gap-2">
                          <span>92%</span> <Badge variant={"outline"}>A</Badge>
                        </p>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-black dark:text-white">
                          Mathematics
                        </p>
                        <p className="text-muted-foreground flex items-center justify-end gap-2">
                          <span>92%</span> <Badge variant={"outline"}>A</Badge>
                        </p>
                      </div>
                      <Progress value={92} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconClock className="size-4" />
                  Attendance Record
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid text-center grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-4">
                    <p className="text-muted-foreground text-xs mb-1">
                      Total Days
                    </p>
                    <p className="text-2xl font-medium text-primary dark:text-white">
                      {attendanceStats.totalSchoolDays}
                    </p>
                  </div>
                  <div className="rounded-md bg-green-50 dark:bg-green-950 p-4">
                    <p className="text-muted-foreground text-xs mb-1">
                      Present
                    </p>
                    <p className="text-2xl font-medium text-green-600 dark:text-white">
                      {attendanceStats.presentDays}
                    </p>
                  </div>
                  <div className="rounded-md bg-red-50 dark:bg-red-950 p-4">
                    <p className="text-muted-foreground text-xs mb-1">Absent</p>
                    <p className="text-2xl font-medium text-red-600 dark:text-white">
                      {attendanceStats.absentDays}
                    </p>
                  </div>
                  <div className={`rounded-md ${attendanceColor} p-4`}>
                    <p className="text-muted-foreground text-xs mb-1">
                      Percentage
                    </p>
                    <p
                      className={`text-2xl font-medium ${attendanceTextColor}`}
                    >
                      {attendancePercentage}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Attendance Rate</p>
                    <p className={`text-sm font-medium ${attendanceTextColor}`}>
                      {attendancePercentage}%
                    </p>
                  </div>
                  <Progress
                    value={attendancePercentage}
                    className={`h-2 ${attendanceColor}`}
                  />
                  <div
                    className={`flex items-center gap-2 ${attendanceTextColor}`}
                  >
                    <IconCheck className="size-4" />
                    <p className="text-sm">{attendanceDescription}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconWallet className="size-4" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <ComingSoon />
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Payment Status
                    </p>
                    <Badge variant="default" className="bg-green-600">
                      Paid
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">
                      Balance
                    </p>
                    <p className="text-lg font-medium text-green-600">₦0</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Fees
                    </p>
                    <p className="font-medium">₦450,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Amount Paid
                    </p>
                    <p className="font-medium text-green-600">₦450,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Outstanding
                    </p>
                    <p className="font-medium text-green-600">₦0</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3">Last Payment</p>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">₦150,000</p>
                      <p className="text-xs text-muted-foreground">
                        15/09/2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <IconEye />
                      View Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="md:hidden">
              <QuickActions
                lastName={student?.lastName}
                firstName={student?.firstName}
                image={student?.image}
                email={student?.email}
                role={student?.role}
                username={student?.username}
                studentId={student?.id}
                schoolRoles={student?.schoolRoles}
                onRefresh={() => handleRefresh()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
