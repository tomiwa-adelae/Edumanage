import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assignment } from "@/store/useAuth";
import { Badge } from "@/components/ui/badge";
import {
  IconFileDescription,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import React from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  assignments: Assignment[];
}

export const StudentAssignments = ({ assignments }: Props) => {
  if (!assignments || assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2">
            <IconFileDescription className="size-4" />
            Assignment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            No assignments found for this student
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (assignment: Assignment) => {
    const submission = assignment.assignmentSubmissions?.[0];

    if (!submission) {
      const dueDate = new Date(assignment.dueDate);
      const now = new Date();
      if (dueDate < now) {
        return <Badge variant="destructive">Not Submitted (Late)</Badge>;
      }
      return <Badge variant="pending">Not Submitted</Badge>;
    }

    // Check the submission status from the enum
    if (submission.status === "GRADED") {
      return <Badge variant="success">Graded</Badge>;
    }

    if (submission.status === "SUBMITTED" || submission.status === "ON_TIME") {
      return <Badge variant="default">Submitted</Badge>;
    }

    if (submission.status === "LATE") {
      return <Badge variant="destructive">Submitted Late</Badge>;
    }

    if (submission.status === "RESUBMIT") {
      return <Badge variant="pending">Resubmit Required</Badge>;
    }

    if (submission.status === "PENDING") {
      return <Badge variant="pending">Pending Review</Badge>;
    }

    return <Badge variant="pending">Pending</Badge>;
  };

  const getTotalAndCompleted = () => {
    const total = assignments.length;
    const completed = assignments.filter(
      (a) =>
        a.assignmentSubmissions?.[0]?.status === "GRADED" ||
        a.assignmentSubmissions?.[0]?.status === "SUBMITTED" ||
        a.assignmentSubmissions?.[0]?.status === "ON_TIME" ||
        a.assignmentSubmissions?.[0]?.status === "LATE"
    ).length;
    const pending = total - completed;
    const late = assignments.filter((a) => {
      const submission = a.assignmentSubmissions?.[0];
      const dueDate = new Date(a.dueDate);
      const now = new Date();
      // Late if: submitted late OR not submitted and past due date
      return submission?.status === "LATE" || (!submission && dueDate < now);
    }).length;

    return { total, completed, pending, late };
  };

  const stats = getTotalAndCompleted();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-2">
          <IconFileDescription className="size-4" />
          Assignment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-medium text-primary">{stats.total}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-medium text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-medium text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Late</p>
            <p className="text-2xl font-medium text-red-600">{stats.late}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium">Recent Assignments</p>
          <div className="space-y-2">
            {assignments.map((assignment) => {
              const submission = assignment.assignmentSubmissions?.[0];
              return (
                <div
                  key={assignment.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.subject?.name || assignment.Subject?.name}
                      </p>
                    </div>
                    {getStatusBadge(assignment)}
                  </div>

                  <div className="space-y-2">
                    {/* <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(assignment)}
                    </div> */}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <IconCalendar className="size-3" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                      {submission?.submittedAt && (
                        <div className="flex items-center gap-1">
                          <IconClock className="size-3" />
                          <span>
                            Submitted: {formatDate(submission.submittedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {submission?.grade && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Score: </span>
                      <span className="font-medium">
                        {submission.grade}/{assignment.totalMarks}
                      </span>
                    </div>
                  )}

                  {submission?.gradingComment && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Feedback: </span>
                      <span>{submission.gradingComment}</span>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/t/assignments/${assignment.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
