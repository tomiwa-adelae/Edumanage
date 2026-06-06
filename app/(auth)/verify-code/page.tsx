import React from "react";
import { VerifyCodeForm } from "../_components/VerifyCodeForm";
import { FullLogo } from "../_components/Logo";
import { authMetadata } from "@/lib/metadata";

export const metadata = authMetadata.verifyCode;

type SearchParams = Promise<{
  email: string;
}>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { email } = await searchParams;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <FullLogo />
      </div>
      <VerifyCodeForm email={email} />
    </div>
  );
};

export default page;
