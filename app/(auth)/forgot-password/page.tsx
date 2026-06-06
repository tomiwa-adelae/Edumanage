import React from "react";
import { ForgotPasswordForm } from "../_components/ForgotPasswordForm";
import { FullLogo } from "../_components/Logo";
import { authMetadata } from "@/lib/metadata";

export const metadata = authMetadata.forgotPassword;

const page = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <FullLogo />
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default page;
