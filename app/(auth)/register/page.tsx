import React from "react";
import { IconBook, IconShield, IconUsers } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { FullLogo } from "../_components/Logo";
import { RegisterForm } from "../_components/RegisterForm";
import { configService } from "@/lib/configs";
import { authMetadata } from "@/lib/metadata";

export const metadata = authMetadata.register;

const page = async () => {
  try {
    const [schoolTypes, jobRoles, ownershipTypes, countries, states] =
      await Promise.all([
        configService.getCategory("SCHOOL_TYPE"),
        configService.getCategory("JOB_ROLE"),
        configService.getCategory("OWNERSHIP_TYPE"),
        configService.getCategory("COUNTRY"),
        configService.getCategory("STATE"),
      ]);

    return (
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-center">
          <FullLogo />
        </div>
        <RegisterForm
          schoolTypes={schoolTypes.items}
          jobRoles={jobRoles.items}
          ownershipTypes={ownershipTypes.items}
          countries={countries.items}
          states={states.items}
        />
      </div>
    );
  } catch (err) {
    // fallback empty data so build won't fail
    return (
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-center">
          <FullLogo />
        </div>
        <RegisterForm
          schoolTypes={[]}
          jobRoles={[]}
          ownershipTypes={[]}
          countries={[]}
          states={[]}
        />
      </div>
    );
  }
};

export default page;
