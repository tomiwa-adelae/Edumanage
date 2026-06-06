"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StudentApprovalCards } from "../../_components/StudentApprovalCards";
import { StudentSearchComponent } from "../../_components/StudentSearchComponent";
import { Class, useAuth, User } from "@/store/useAuth";
import { schoolService } from "@/lib/school";
import { toast } from "sonner";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { ListSkeleton } from "@/components/ListSkeleton";
import { ApprovalStudentBox } from "./_components/ApprovalStudentBox";
import { NothingFound } from "@/components/NothingFound";

const page = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]); // ✅ merged list
  const [classes, setClasses] = useState<Class[]>([]); // ✅ merged list
  const [rejectedStudents, setRejectedStudents] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId) return;

      try {
        const [students, rejectedStudents, classes] = await Promise.all([
          schoolService.getStudentsPendingApproval(user?.schoolId!),
          schoolService.getRejectedStudentsApproval(user?.schoolId!),
          schoolService.getSchoolClasses(user?.school?.schoolID!),
        ]);

        setRejectedStudents(rejectedStudents);
        setStudents(students);
        setClasses(classes);
        setAllStudents([...students, ...rejectedStudents]);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  const handleStudentStatusChange = (
    id: string,
    status: "approved" | "rejected"
  ) => {
    if (status === "approved") {
      // Remove approved student completely
      setStudents((prev) => prev.filter((s: any) => s.id !== id));
      setAllStudents((prev) => prev.filter((s: any) => s.id !== id));
    } else if (status === "rejected") {
      // Update student’s status in place
      setAllStudents((prev) =>
        prev.map((s: any) =>
          s.id === id
            ? {
                ...s,
                Student: {
                  ...s.Student,
                  isRejected: true,
                  isApproved: false,
                },
              }
            : s
        )
      );

      setRejectedStudents((prev) => {
        const alreadyInList = prev.some((r: any) => r.id === id);
        if (alreadyInList) return prev; // avoid duplicates
        const student = allStudents.find((s: any) => s.id === id);
        return student ? [...prev, student] : prev;
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Student Approvals"}
        description={"Review and approve student enrollment requests"}
      />
      {loading ? (
        <>
          <CardsSkeleton count={2} />
          <ListSkeleton items={5} showHeader={false} itemHeight="h-32" />
        </>
      ) : (
        <>
          <StudentApprovalCards
            students={students.length}
            rejectedStudents={rejectedStudents.length}
          />
          <StudentSearchComponent />
          <div className="space-y-4">
            {allStudents.length === 0 && <NothingFound message="No students yet" />}
            {allStudents.map((student) => (
              <ApprovalStudentBox
                key={student?.id}
                student={student}
                onStudentStatusChange={handleStudentStatusChange}
                classes={classes}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default page;
