"use client";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import { SubmissionAttachment } from "@/components/SubmissionAttachment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { teacherService } from "@/lib/teacher";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { Assignment, AssignmentSubmissions, useAuth } from "@/store/useAuth";
import {
  IconAward,
  IconBook,
  IconMail,
  IconMessage,
  IconPaperclip,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { Award, CircleCheckBig, Dot } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { GradeForm } from "../../../_components/GradeForm";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const page = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const [assignment, setAssignment] = useState<AssignmentSubmissions>();

  const [loading, setLoading] = useState(true);
  const [gradeForm, showGradeForm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId || !id) return;

      try {
        const [assignment] = await Promise.all([
          teacherService.getStudentAssignmentsDetails(user?.school?.id!, id),
        ]);

        setAssignment(assignment);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, id]);

  const refreshAssignment = async () => {
    if (!user?.schoolId || !id) return;
    try {
      const [assignment] = await Promise.all([
        teacherService.getStudentAssignmentsDetails(user?.school?.id!, id),
      ]);

      setAssignment(assignment);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to refresh assignment"
      );
    }
  };

  if (loading) return <Loader />;

  if (!assignment) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={assignment?.Assignment.title}
        back
        description={
          <p className="flex items-center justify-start text-xs sm:text-sm md:text-base">
            <div className="flex items-center justify-start gap-2">
              <IconBook className="size-4" />{" "}
              <span>{assignment?.Assignment.subject.name}</span>
            </div>
            <Dot />
            <Badge>
              {assignment?.Class.level}
              {assignment?.Class.section}
            </Badge>
            {assignment?.status === "GRADED" && (
              <>
                <Dot />
                <Badge variant={"success"}>{assignment?.status}</Badge>
              </>
            )}
          </p>
        }
      />
      <Separator />
      <div className="flex items-center justify-start gap-2">
        <UserProfilePicture
          src={assignment?.Student?.user?.image}
          alt={`${assignment?.Student.user?.firstName}'s picture`}
        />
        <div>
          <p className="text-base font-medium">
            {assignment?.Student?.user?.firstName}{" "}
            {assignment?.Student?.user?.lastName}
          </p>
          <p className="text-xs text-muted-foreground md:text-sm flex items-center justify-start gap-1">
            {assignment?.Student?.admissionNumber}
            <Dot className="size-4" />
            {assignment?.Class.level}
            {assignment?.Class.section}
            <Dot className="size-4" />
            {formatDate(assignment?.submittedAt)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconPaperclip className="size-4 text-primary" />
                  Submitted Files{" "}
                  <Badge variant={"secondary"}>
                    {assignment?.attachments.length} files
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignment?.attachments.map((attachment) => (
                  <SubmissionAttachment
                    key={attachment.id}
                    attachment={attachment}
                  />
                ))}
              </CardContent>
            </Card>

            {assignment?.comment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconMail className="size-4 text-primary" />
                    Student's Comment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="rounded-md bg-primary/5 p-4 text-sm lg:text-base border border-primary">
                    {assignment?.comment}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconAward className="size-4 text-primary" />
                  Grading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignment?.status === "GRADED" ? (
                  <div>
                    <div className="space-y-1.5 border bg-green-100/80 dark:bg-green-900/80 border-green-500 dark:border-green-900 rounded-md px-3 py-5">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Score
                      </p>
                      <p className="text-base text-green-900 dark:text-100 dark:text-green-100 lg:text-lg">
                        {assignment.grade}/
                        {assignment.Assignment.totalMarks === 0
                          ? 100
                          : assignment.Assignment.totalMarks}
                      </p>

                      {/* ✅ Move logic outside JSX expression */}
                      {(() => {
                        const total =
                          assignment.Assignment.totalMarks === 0
                            ? 100
                            : Number(assignment.Assignment.totalMarks);
                        const grade = Number(assignment.grade) || 0;
                        const percentage = (grade / total) * 100;

                        return (
                          <>
                            <p className="text-xs text-green-700">
                              {percentage.toFixed(1)}%
                            </p>

                            {/* ✅ Works now */}
                            <Progress
                              value={percentage}
                              className="h-2 bg-green-100"
                            />
                          </>
                        );
                      })()}
                    </div>
                    <p className="flex items-center justify-start line-clamp-1 gap-1 text-xs text-muted-foreground mt-1.5">
                      <CircleCheckBig className="size-3" />
                      Graded on {formatDate(assignment.gradedAt)} by{" "}
                      {assignment?.gradedBy?.user?.firstName}{" "}
                      {assignment?.gradedBy?.user?.lastName}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Award className="h-10 text-muted-foreground" />
                    <p className="text sm text-muted-foreground">
                      This submission hasn't been graded yet
                    </p>
                    <Button onClick={() => showGradeForm(true)}>
                      <IconAward />
                      Grade now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <UserProfilePicture
                  size="md"
                  src={assignment?.Student?.user?.image}
                  alt={`${assignment?.Student.user?.image}'s picture`}
                />
                <div className="space-y-1 text-center mt-2">
                  <p className="font-medium text-base">
                    {" "}
                    {assignment?.Student?.user?.firstName}{" "}
                    {assignment?.Student?.user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {" "}
                    {assignment?.Student?.admissionNumber}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant={"secondary"}>
                      {assignment?.Class.level}
                      {assignment?.Class.section}
                    </Badge>
                    {assignment?.Student?.user?.department && (
                      <Badge variant={"secondary"}>
                        {assignment?.Student?.user?.department}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium text-base">Contact Information</p>
                <div className="space-y-4 text-muted-foreground text-sm">
                  <div className="flex items-start justify-start gap-2">
                    <IconMail className="size-5" />
                    <div>
                      <p className="text-xs">Email</p>
                      <p className="text-black dark:text-white font-medium">
                        {assignment?.Student?.user?.email ? (
                          <a
                            className="hover:underline hover:text-primary"
                            href={`mailto:${assignment?.Student?.user.email}`}
                          >
                            {assignment?.Student?.user.email}
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
                      <p className="text-xs">Student Phone</p>
                      <p className="text-black dark:text-white font-medium">
                        {assignment?.Student.user?.phoneNumber ? (
                          <a
                            className="hover:underline hover:text-primary"
                            href={`tel:${assignment?.Student.user?.phoneNumber}`}
                          >
                            {formatPhoneNumber(
                              assignment?.Student.user?.phoneNumber
                            )}
                          </a>
                        ) : (
                          <span className="italic">No phone</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-start gap-2">
                    <IconPhone className="size-5" />
                    <div>
                      <p className="text-xs">Parent Phone</p>
                      <p className="text-black dark:text-white font-medium">
                        {assignment?.Student.ParentStudentLink[0].parent.user
                          ?.phoneNumber ? (
                          <a
                            className="hover:underline hover:text-primary"
                            href={`tel:${assignment?.Student.ParentStudentLink[0].parent.user?.phoneNumber}`}
                          >
                            {formatPhoneNumber(
                              assignment?.Student.ParentStudentLink[0].parent
                                .user?.phoneNumber
                            )}
                          </a>
                        ) : (
                          <span className="italic">No phone</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />{" "}
              <div className="space-y-2">
                <p className="font-medium text-base">Assignment Details</p>
                <div className="space-y-2 text-muted-foreground text-sm">
                  <p className="flex items-center justify-between gap-1">
                    <span>Due Date:</span>
                    <span>{formatDate(assignment?.Assignment.dueDate)}</span>
                  </p>
                  <p className="flex items-center justify-between gap-1">
                    <span>Total Marks:</span>
                    <span>{assignment?.Assignment.totalMarks}</span>
                  </p>
                  <p className="flex items-center justify-between gap-1">
                    <span>Status:</span>
                    <span>{assignment?.status}</span>
                  </p>
                </div>
              </div>
              <Separator />{" "}
              <div className="space-y-2">
                <p className="font-medium text-base">Quick Actions</p>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant={"outline"}
                    className="w-full justify-start"
                  >
                    <Link
                      href={`/t/students/${assignment?.Student?.user?.username}`}
                    >
                      <IconUser />
                      View Student Profile
                    </Link>
                  </Button>
                  <Button variant={"outline"} className="w-full justify-start">
                    <IconMessage />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {gradeForm && (
        <GradeForm
          submissionId={assignment?.id}
          totalMarks={assignment?.Assignment.totalMarks}
          open={gradeForm}
          onClose={() => {
            showGradeForm(false);
          }}
          onRefresh={refreshAssignment}
        />
      )}
    </div>
  );
};

export default page;
