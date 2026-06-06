"use client";
import { AssignmentAttachment } from "@/components/AssignmentAttachment";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { teacherService } from "@/lib/teacher";
import { cn, formatDate } from "@/lib/utils";
import { Assignment, useAuth } from "@/store/useAuth";
import {
  IconAlertCircle,
  IconAward,
  IconBook,
  IconCalendar,
  IconClock,
  IconFileDescription,
  IconPaperclip,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Dot } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { StudentSubmissionCard } from "../../_components/StudentSubmissionCard";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

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
          teacherService.getTeacherAssignmentsDetails(
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

  const refreshAssignment = async () => {
    if (!user?.schoolId || !slug) return;

    try {
      const [assignment] = await Promise.all([
        teacherService.getTeacherAssignmentsDetails(
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

  if (loading) return <Loader />;

  if (!assignment) return notFound();
  return (
    <div className="space-y-6">
      <PageHeader
        title={assignment?.title}
        back
        description={
          <p className="flex items-center justify-start gap-1 text-xs sm:text-sm md:text-base">
            <div className="flex items-center justify-start gap-2">
              <IconBook className="size-4" />{" "}
              <span>{assignment?.subject.name}</span>
            </div>
            <Dot />
            <Badge>
              {assignment?.Class.level}
              {assignment?.Class.section}
            </Badge>
          </p>
        }
      />
      <Separator />
      <div
        className={cn(
          "grid grid-cols-2 text-xs gap-2 2xl:grid-cols-4 2xl:gap-4",
          assignment?.totalMarks !== 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"
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
            <IconUsers className="size-4 text-primary" />
            <span className="text-muted-foreground">Students</span>
          </p>
          <p className="text-primary">{assignment?.Class?.students?.length}</p>
        </div>

        {assignment?.totalMarks !== 0 && (
          <div className="space-y-2 rounded-md p-4 border">
            <p className="flex items-center justify-start gap-1">
              <IconAward className="size-4 text-primary" />
              <span className="text-muted-foreground">Total marks</span>
            </p>
            <p className="text-primary">{assignment?.totalMarks}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 2xl:gap-4">
        <div className="lg:col-span-2">
          <div className="grid gap-2 2xl:gap-4">
            <Card className="gap-1.5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFileDescription className="size-4 text-primary" />
                  Description
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
                  <RenderDescription json={assignment.instructions} />
                ) : (
                  <span className="italic">No instructions given</span>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconPaperclip className="size-4 text-primary" />
                  Your Attachments{" "}
                  <Badge variant={"secondary"}>
                    {assignment?.attachments.length} files
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
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
        <div className="lg:col-span-3 grid gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconUsersGroup className="size-4 text-primary" />
                Students Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchBarWrapper placeholder="Search students..." />
              {assignment?.assignmentSubmissions.map((submission) => (
                <StudentSubmissionCard
                  key={submission.id}
                  submission={submission}
                  slug={assignment.slug}
                  onRefresh={refreshAssignment}
                  totalMarks={assignment.totalMarks}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
