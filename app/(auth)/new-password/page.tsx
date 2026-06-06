import React from "react";
import { NewPasswordForm } from "../_components/NewPasswordForm";
import { FullLogo } from "../_components/Logo";
import { authMetadata } from "@/lib/metadata";

export const metadata = authMetadata.newPassword;

type SearchParams = Promise<{
  email: string;
  otp: string;
}>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { email, otp } = await searchParams;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <FullLogo />
      </div>
      <NewPasswordForm email={email} otp={otp} />
    </div>
  );
};

export default page;
