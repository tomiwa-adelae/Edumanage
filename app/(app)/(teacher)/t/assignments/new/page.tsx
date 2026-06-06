"use client";
import { PageHeader } from "@/components/PageHeader";
import React, { useEffect, useState } from "react";
import { NewAssignmentForm } from "../../_components/NewAssignmentForm";
import { Class, useAuth } from "@/store/useAuth";
import { Subject } from "@/app/(app)/(admin)/a/subjects/page";
import { schoolService } from "@/lib/school";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { teacherService } from "@/lib/teacher";

const page = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!user?.schoolId) return;

      try {
        const [classes, subjects] = await Promise.all([
          teacherService.getTeacherClasses(user?.school?.id!, user.id!),
          teacherService.getTeacherSubjects(user?.school?.id!, user.id!),
        ]);

        setClasses(classes);
        setSubjects(subjects);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Assignment or Lesson Note"
        description="Create a new assignment, homework, or lesson note for your students"
        back
      />
      <NewAssignmentForm classes={classes} subjects={subjects} />
    </div>
  );
};

export default page;
