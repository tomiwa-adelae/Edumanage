"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatDate } from "@/lib/utils";
import { AssignmentSubmissions } from "@/store/useAuth";
import { IconAward, IconClock, IconEye, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";
import { GradeForm } from "./GradeForm";
import { Award } from "lucide-react";

interface Props {
  submission: AssignmentSubmissions;
  slug: string;
  onRefresh: () => void;
  totalMarks: number;
}

export const StudentSubmissionCard = ({
  submission,
  slug,
  onRefresh,
  totalMarks,
}: Props) => {
  const [gradeForm, showGradeForm] = useState(false);
  return (
    <Card>
      <CardContent className="flex flex-col 2xl:flex-row items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start justify-start w-full gap-3 flex-1 min-w-0">
          <UserProfilePicture
            src={submission.Student.user?.image}
            alt={`${submission.Student.user?.firstName}'s picture`}
          />
          <div className="space-y-1.5 w-full">
            <div>
              <p className="flex items-center justify-start gap-2 font-medium text-base flex-wrap">
                <span>
                  {submission.Student.user?.firstName}{" "}
                  {submission.Student.user?.lastName}
                </span>
                <Badge
                  variant={
                    submission.status === "PENDING"
                      ? "pending"
                      : submission.status === "GRADED"
                      ? "success"
                      : "default"
                  }
                >
                  {submission.status}
                </Badge>
              </p>
              <p className="text-xs md:text-sm text-muted-foreground break-words">
                {submission?.Student.admissionNumber}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs md:text-sm flex items-center justify-start gap-1">
                <IconClock className="size-4" />
                {formatDate(submission.submittedAt)}
              </p>
              {submission.comment && (
                <p className="hidden text-muted-foreground dark:text-white md:flex items-center justify-start gap-1 text-sm w-full bg-muted rounded-md p-2 break-words whitespace-normal">
                  <IconMail className="size-4" />
                  {submission.comment}
                </p>
              )}
              {submission.status === "GRADED" && (
                <p className="hidden md:block text-sm w-full bg-green-100/80 dark:bg-green-900 rounded-md p-2 break-words whitespace-normal">
                  <p className="flex items-center w-full justify-between gap-2 text-green-800 dark:text-green-100">
                    <p className="flex items-center justify-start gap-1">
                      <Award className="size-4" />
                      Score
                    </p>
                    <p>
                      {" "}
                      {submission.grade}/{totalMarks === 0 ? 100 : totalMarks}
                    </p>
                  </p>
                  <p className="text-black dark:text-white mt-1">
                    {submission.gradingComment}
                  </p>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 md:hidden">
          {submission.comment && (
            <p className="text-muted-foreground flex items-center justify-start gap-1 text-sm w-full bg-muted rounded-md p-2 break-words whitespace-normal">
              <IconMail className="size-4" />
              {submission.comment}
            </p>
          )}
          {submission.status === "GRADED" && (
            <p className="text-sm w-full bg-green-100/80 rounded-md p-2 break-words whitespace-normal">
              <p className="flex items-center w-full justify-between gap-2 text-green-800">
                <p className="flex items-center justify-start gap-1">
                  <Award className="size-4" />
                  Score
                </p>
                <p>
                  {" "}
                  {submission.grade}/{totalMarks === 0 ? 100 : totalMarks}
                </p>
              </p>
              <p className="text-black mt-1">{submission.gradingComment}</p>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row 2xl:justify-end gap-2 w-full 2xl:w-auto mt-2 2xl:mt-0">
          <Button
            asChild
            className="flex-1 2xl:flex-none w-full 2xl:w-auto"
            variant="outline"
          >
            <Link href={`/t/assignments/${slug}/${submission.id}`}>
              <IconEye />
              View
            </Link>
          </Button>
          <Button
            onClick={() => showGradeForm(true)}
            disabled={submission.status === "GRADED"}
            className="flex-1 2xl:flex-none w-full 2xl:w-auto"
          >
            <IconAward />
            Grade
          </Button>
        </div>
      </CardContent>
      {gradeForm && (
        <GradeForm
          submissionId={submission?.id}
          totalMarks={totalMarks}
          open={gradeForm}
          onClose={() => {
            showGradeForm(false);
          }}
          onRefresh={onRefresh}
        />
      )}
    </Card>
  );
};
