"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IconFileTypeXls, IconShare, IconUserPlus } from "@tabler/icons-react";
import { configService } from "@/lib/configs";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { FormSkeleton } from "@/components/FormSkeleton";
import { schoolService } from "@/lib/school";
import { notFound, useParams } from "next/navigation";
import { useAuth, User } from "@/store/useAuth";
import { EditStaffForm } from "../../_components/EditStaffForm";

const page = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  const [staff, setStaff] = useState<User>();

  const [jobRoles, setJobRoles] = useState<any>();
  const [states, setStates] = useState<any>();
  const [countries, setCountries] = useState<any>();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [jobRoles, states, countries, staff] = await Promise.all([
          configService.getCategory("JOB_ROLE"),
          configService.getCategory("STATE"),
          configService.getCategory("COUNTRY"),
          schoolService.getSchoolStaff(user?.school?.id!, username!),
        ]);

        setJobRoles(jobRoles);
        setStates(states);
        setCountries(countries);
        setStaff(staff);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Staff Details"
        description="Loading staff information..."
        back
      />
      <FormSkeleton fields={10} showHeader={false} columns={2} />
    </div>
  );

  if (!staff) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${staff?.firstName} ${staff?.lastName} details`}
        back
      />
      <EditStaffForm
        staff={staff}
        states={states.items}
        countries={countries.items}
        jobRoles={jobRoles.items}
      />
    </div>
  );
};

export default page;
