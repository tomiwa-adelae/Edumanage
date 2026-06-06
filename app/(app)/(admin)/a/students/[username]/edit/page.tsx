"use client";
import { FormSkeleton } from "@/components/FormSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { schoolService } from "@/lib/school";
import { Class, useAuth, User } from "@/store/useAuth";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditStudentForm } from "../../_components/EditStudentForm";
import { configService } from "@/lib/configs";

const page = () => {
  const { user } = useAuth();

  const { username } = useParams();

  const [student, setStudent] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<any>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [countries, setCountries] = useState<any>([]);
  const [departments, setDepartments] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !user.school?.id || !username) return;

      try {
        const [states, classes, countries, departments, student] =
          await Promise.all([
            configService.getCategory("STATE"),
            schoolService.getSchoolClasses(user?.school?.schoolID!),
            configService.getCategory("COUNTRY"),
            configService.getCategory("SCHOOL_DEPARTMENT"),
            schoolService.getStudentDetails(user?.school?.id!, username!),
          ]);

        setStudent(student);
        setStates(states);
        setClasses(classes);
        setCountries(countries);
        setDepartments(departments);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, username]);

  if (loading) return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student Details"
        description="Loading student information..."
        back
      />
      <FormSkeleton fields={12} showHeader={false} columns={2} />
    </div>
  );

  if (!student) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${student?.firstName} ${student?.lastName} details`}
        back
      />
      <EditStudentForm
        states={states.items}
        classes={classes}
        countries={countries.items}
        departments={departments.items}
        student={student}
      />
    </div>
  );
};

export default page;
