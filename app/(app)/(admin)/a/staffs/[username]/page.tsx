"use client";
import React, { useEffect, useState } from "react";
import {
  IconBooks,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { DetailsSkeleton } from "@/components/DetailsSkeleton";
import { schoolService } from "@/lib/school";
import { Class, School, useAuth, User } from "@/store/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StaffProfile } from "../_components/StaffProfile";
import { StaffContactInformation } from "../_components/StaffContactInformation";
import { StaffPerformance } from "../_components/StaffPerformance";
import { StaffHandled } from "../_components/StaffHandled";
import { StaffClasses } from "../_components/StaffClasses";
import { StaffQualifications } from "../_components/StaffQualifications";
import { StaffCertifications } from "../_components/StaffCertifications";
import { StaffSalary } from "../_components/StaffSalary";
import { StaffBankDetails } from "../_components/StaffBankDetails";
import { QuickActions } from "../_components/QuickActions";
import { configService } from "@/lib/configs";

const page = () => {
  const { user } = useAuth();

  const { username } = useParams();

  const [staff, setStaff] = useState<User>();
  const [jobRoles, setJobRoles] = useState<any>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !user.school?.schoolID || !username) return;

      try {
        const [staff, jobRoles] = await Promise.all([
          schoolService.getSchoolStaff(user?.school?.id!, username!),
          configService.getCategory("JOB_ROLE"),
        ]);

        setStaff(staff);
        setJobRoles(jobRoles);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, username]);

  const handleRefresh = async () => {
    if (!user || !user.school?.schoolID || !username) return;

    try {
      const [staff, jobRoles] = await Promise.all([
        schoolService.getSchoolStaff(user?.school?.id!, username!),
        configService.getCategory("JOB_ROLE"),
      ]);
      setStaff(staff);
      setJobRoles(jobRoles);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Staff Details"
          description="Loading staff information..."
          back
        />
        <DetailsSkeleton sections={6} showAvatar={true} />
      </div>
    );

  if (!staff) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Staff Details`}
        description={`Complete information about the ${staff.firstName} ${staff.lastName}`}
        secondaryCTA={{
          label: "Edit",
          slug: `/a/staffs/${staff?.username}/edit`,
          icon: IconEdit,
        }}
        back
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="col-span-1 lg:col-span-3">
          <div className="grid gap-4 ">
            <StaffProfile
              firstName={staff.firstName}
              lastName={staff.lastName}
              email={staff.email}
              employeeID={staff.employeeID}
              role={staff.role}
              image={staff.image}
              title={staff.title}
              dob={staff.dob}
              joinedDate={staff.createdAt}
              schoolRoles={staff.schoolRoles}
            />
            <StaffContactInformation
              email={staff.email}
              phoneNumber={staff.phoneNumber}
              address={`${staff.address}, ${staff.city}, ${staff.state}, ${staff.country}`}
              emergencyContactName={staff.emergencyContactName}
              emergencyPhoneNumber={staff.emergencyPhoneNumber}
            />
            <StaffPerformance classes={staff.Teacher?.classes} />
            <div className="hidden md:block">
              <QuickActions
                firstName={staff.firstName}
                lastName={staff.lastName}
                role={staff.role}
                image={staff.image}
                email={staff.email}
                username={staff?.username}
                staffId={staff?.id}
                jobRoles={jobRoles.items}
                schoolRoles={staff?.schoolRoles}
                onRefresh={() => handleRefresh()}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="grid gap-4">
            <StaffHandled assignments={staff.Teacher?.assignments} />
            <StaffClasses classes={staff.Teacher?.classes} />
            <StaffQualifications />
            <StaffCertifications />
            <StaffSalary />
            <StaffBankDetails />
            <div className="md:hidden">
              <QuickActions
                firstName={staff.firstName}
                username={staff?.username}
                lastName={staff?.lastName}
                role={staff?.role}
                image={staff.image}
                email={staff.email}
                jobRoles={jobRoles.items}
                staffId={staff?.id}
                schoolRoles={staff?.schoolRoles}
                onRefresh={() => handleRefresh()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
