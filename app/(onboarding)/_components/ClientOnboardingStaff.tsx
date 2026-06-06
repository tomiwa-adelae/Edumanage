"use client";

import { useEffect, useState } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { toast } from "sonner";

import { FullLogo } from "@/app/(auth)/_components/Logo";
import { Loader } from "@/components/Loader";
import { configService } from "@/lib/configs";
import { schoolService } from "@/lib/school";
import { School } from "@/store/useAuth";
import { OnboardingStaffForm } from "./OnboardingStaffForm";

export default function ClientOnboardingStaff() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [jobRoles, setJobRoles] = useState<any>();
  const [states, setStates] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [school, setSchool] = useState<School>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [jobRolesRes, countriesRes, statesRes, schoolRes] =
          await Promise.all([
            configService.getCategory("JOB_ROLE"),
            configService.getCategory("COUNTRY"),
            configService.getCategory("STATE"),
            schoolService.getSchool(id),
          ]);

        setJobRoles(jobRolesRes);
        setStates(statesRes);
        setCountries(countriesRes);
        setSchool(schoolRes);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (!school) return notFound();

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center">
        <FullLogo
          name={school.name}
          acronym={school.acronym!}
          logo={school.logo!}
        />
      </div>
      <OnboardingStaffForm
        jobRoles={jobRoles.items}
        countries={countries.items}
        states={states.items}
        schoolID={school.schoolID!}
        acronym={school.acronym!}
      />
    </div>
  );
}
