import React from "react";
import { FullLogo } from "./_components/Logo";
import { IconBook, IconShield, IconUsers } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { LoginForm } from "./_components/LoginForm";
import { authMetadata } from "@/lib/metadata";

export const metadata = authMetadata.login;

const page = () => {
  const features = [
    {
      title: "Student & Staff Management",
      description:
        "Complete profiles, attendance tracking, and communication tools",
      icon: IconUsers,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Real-time Assessments",
      description: "Curriculum management, assessments, and detailed reporting",
      icon: IconBook,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Secure Payments",
      description: "Enterprise-grade security with role-based access control",
      icon: IconShield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="hidden lg:flex flex-col justify-center space-y-4 lg:col-span-3">
          <div className="space-y-2">
            <FullLogo />
            <p className="text-sm md:text-base text-muted-foreground">
              Streamline your school with attendance, assessments,
              communication, and payments — all in one place.
            </p>
          </div>
          <div className="space-y-4">
            {features.map(
              ({ title, icon, color, bgColor, description }, index) => {
                const Icon = icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-card rounded-md border border-accent p-2 flex items-center justify-start gap-2"
                  >
                    <div className={cn("rounded-md p-3", color, bgColor)}>
                      <Icon />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-center lg:hidden">
            <FullLogo />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default page;
