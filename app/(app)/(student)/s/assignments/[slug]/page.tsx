"use client";
import { AssignmentAttachment } from "@/components/AssignmentAttachment";
import { Loader } from "@/components/Loader";
import { NothingFound } from "@/components/NothingFound";
import { PageHeader } from "@/components/PageHeader";
import { StudentAssignmentSubmission } from "@/components/StudentAssignmentSubmission";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { studentService } from "@/lib/student";
import { calculateTimeLeft, cn, formatDate } from "@/lib/utils";
import { Assignment, useAuth } from "@/store/useAuth";
import {
  IconAlertCircle,
  IconAward,
  IconBook,
  IconCalendar,
  IconClock,
  IconFileDescription,
  IconMail,
  IconPaperclip,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const { user } = useAuth();
  const { slug } = useParams();

  const [assignment, setAssignment] = useState<Assignment>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId || !slug) return;

      try {
        const [assignment] = await Promise.all([
          studentService.getStudentAssignmentsDetails(
            user?.school?.id!,
            user.id,
            slug
          ),
        ]);

        setAssignment(assignment);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, slug]);

  if (loading) return <Loader />;

  if (!assignment) return notFound();

  const { label, colorClass } = calculateTimeLeft(assignment?.dueDate!);

  const hasSubmitted = assignment?.assignmentSubmissions?.some(
    (submission) => submission.studentId === user?.Student.id
  );
  const submission = assignment?.assignmentSubmissions?.find(
    (s) => s.studentId === user?.Student.id
  );
  const hasGraded = submission?.status === "GRADED";
  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <div className="flex items-center gap-1">
            <span>{assignment?.title}</span>
            {(() => {
              if (!hasSubmitted) {
                return <Badge variant="pending">Pending</Badge>;
              }

              if (submission?.status === "GRADED") {
                return <Badge variant="success">Graded</Badge>;
              }

              return <Badge>Submitted</Badge>;
            })()}
          </div>
        }
        back
        description={
          <p className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 text-xs sm:text-sm md:text-base">
            <div className="flex items-center justify-start gap-2">
              <IconBook className="size-4" />{" "}
              <span>{assignment?.subject.name}</span>
            </div>
            <div className="flex items-center justify-start gap-2">
              <IconUser className="size-4" />
              <span>
                {assignment?.Teacher.user?.title}{" "}
                {assignment?.Teacher.user?.firstName}
              </span>
            </div>
            <div className="flex items-center justify-start gap-2">
              <IconMail className="size-4" />
              <a href={`mailto:${assignment?.Teacher.user?.email}`}>
                {assignment?.Teacher.user?.email}
              </a>
            </div>
          </p>
        }
      />

      <Separator />
      <div
        className={cn(
          "grid grid-cols-2 lg:grid-cols-3 text-xs gap-2",
          assignment?.totalMarks !== 0 && "lg:col-span-4"
        )}
      >
        <div className="space-y-2 rounded-md p-4 border">
          <p className="flex items-center justify-start gap-1">
            <IconCalendar className="size-4 text-primary" />
            <span className="text-muted-foreground">Assigned</span>
          </p>
          <p className="text-primary">{formatDate(assignment?.createdAt)}</p>
        </div>
        <div className="space-y-2 rounded-md p-4 border">
          <p className="flex items-center justify-start gap-1">
            <IconClock className="size-4 text-primary" />
            <span className="text-muted-foreground">Due Date</span>
          </p>
          <p className="text-primary">{formatDate(assignment?.dueDate)}</p>
        </div>
        <div
          className={cn(
            "space-y-2 rounded-md p-4 border",
            assignment?.totalMarks === 0 && "col-span-2 lg:col-span-1"
          )}
        >
          <p className="flex items-center justify-start gap-1">
            <IconClock className="size-4 text-primary" />
            <span className="text-muted-foreground">Time left</span>
          </p>
          <p className={colorClass}>{label}</p>
        </div>
        {assignment?.totalMarks !== 0 && (
          <div className="space-y-2 rounded-md p-4 border">
            <p className="flex items-center justify-start gap-1">
              <IconAward className="size-4 text-primary" />
              <span className="text-muted-foreground">Total marks</span>
            </p>
            <p className={"text-primary"}>{assignment?.totalMarks}</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="grid gap-4">
            <Card className="gap-1.5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFileDescription className="size-4 text-primary" />
                  Assignment description
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                {assignment?.description}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconAlertCircle className="size-4 text-primary" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                {assignment?.instructions ? (
                  <RenderDescription json={assignment?.instructions} />
                ) : (
                  <span className="italic">No instructions given</span>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconPaperclip className="size-4 text-primary" />
                  Teacher's Attachments{" "}
                  <Badge variant={"secondary"}>
                    {assignment?.attachments.length} files
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2 text-muted-foreground">
                {assignment?.attachments.length === 0 && (
                  <NothingFound message="No attachments found" />
                )}
                {assignment?.attachments.map((attachment) => (
                  <AssignmentAttachment
                    key={attachment.id}
                    attachment={attachment}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconUpload className="size-4 text-primary" />
                Your submission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              <StudentAssignmentSubmission
                assignmentId={assignment?.id!}
                hasSubmitted={hasSubmitted}
                submission={submission}
                totalMarks={assignment?.totalMarks}
                hasGraded={hasGraded}
              />
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconAlertCircle className="size-4" />
                Need Help?
              </CardTitle>
              <CardDescription>
                Having trouble with this assignment? Contact your teacher:
              </CardDescription>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground space-y-4">
              <div className="space-y-2">
                <p className="flex items-center justify-start gap-2">
                  <IconUser className="size-4" />
                  <span>
                    {assignment?.Teacher.user?.title}{" "}
                    {assignment?.Teacher.user?.firstName}{" "}
                    {assignment?.Teacher.user?.lastName}
                  </span>
                </p>
                <a
                  href={`mailto:${assignment?.Teacher.user?.email}`}
                  className="flex items-center justify-start gap-2 hover:underline text-primary"
                >
                  <IconMail className="size-4" />
                  <span>{assignment?.Teacher.user?.email}</span>
                </a>
              </div>
              <Button className="w-full" asChild variant={"outline"}>
                <a href={`mailto:${assignment?.Teacher.user?.email}`}>
                  Send message
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
