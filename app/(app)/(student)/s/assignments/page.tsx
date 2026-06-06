"use client";
import { AccountPendingModal } from "@/components/AccountPendingModal";
import { Assignment, useAuth } from "@/store/useAuth";
import React, { useEffect, useState } from "react";
import { RejectedApprovalBanner } from "../_components/RejectedApprovalBanner";
import { PageHeader } from "@/components/PageHeader";
import { AssignmentsCards } from "../_components/AssignmentsCards";
import { studentService } from "@/lib/student";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AssignmentCard } from "../_components/AssignmentCard";
import { NothingFound } from "@/components/NothingFound";

const page = () => {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId) return;

      try {
        const [assignments] = await Promise.all([
          studentService.getStudentAssignments(user?.school?.id!, user.id),
        ]);

        setAssignments(assignments);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {user?.Student?.applicationStatus === "pending" && (
        <AccountPendingModal />
      )}
      {user?.Student?.applicationStatus === "rejected" && (
        <RejectedApprovalBanner reasons={user?.Student?.rejectionReason} />
      )}
      <PageHeader
        title="My Assignments"
        description="View and submit your assignments"
      />
      <AssignmentsCards assignments={assignments} />
      <SearchBarWrapper placeholder="Search assignments..." />
      <Tabs defaultValue="all">
        <ScrollArea>
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="all" className="space-y-4 mt-6">
          {assignments.length === 0 && (
            <NothingFound message="No assignments found" />
          )}
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {assignments.filter((assignment) => {
            const submission = assignment.assignmentSubmissions?.find(
              (s) => s.studentId === user?.Student.id
            );
            return !submission; // No submission yet → pending
          }).length === 0 && <NothingFound message="No assignments found" />}
          {assignments
            .filter((assignment) => {
              const submission = assignment.assignmentSubmissions?.find(
                (s) => s.studentId === user?.Student.id
              );
              return !submission; // No submission yet → pending
            })
            .map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4 mt-6">
          {assignments.filter((assignment) => {
            const submission = assignment.assignmentSubmissions?.find(
              (s) => s.studentId === user?.Student.id
            );
            return submission && submission.status !== "GRADED"; // Submitted but not graded
          }).length === 0 && <NothingFound message="No assignments found" />}
          {assignments
            .filter((assignment) => {
              const submission = assignment.assignmentSubmissions?.find(
                (s) => s.studentId === user?.Student.id
              );
              return submission && submission.status !== "GRADED"; // Submitted but not graded
            })
            .map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4 mt-6">
          {assignments.filter((assignment) => {
            const submission = assignment.assignmentSubmissions?.find(
              (s) => s.studentId === user?.Student.id
            );
            return submission?.status === "GRADED"; // Only graded
          }).length === 0 && <NothingFound message="No assignments found" />}
          {assignments
            .filter((assignment) => {
              const submission = assignment.assignmentSubmissions?.find(
                (s) => s.studentId === user?.Student.id
              );
              return submission?.status === "GRADED"; // Only graded
            })
            .map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
