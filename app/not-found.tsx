"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { PageGradient } from "./(auth)/_components/PageGradient";
import { PageHeader } from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import { FullLogo } from "./(auth)/_components/Logo";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <div className="relative">
        {/* <PageGradient /> */}
        <div className="container flex items-center justify-center">
          {/* {session === null ? <Header /> : <MemberHeader />} */}
          <div className="space-y-2.5">
            {/* <FullLogo /> */}
            <div className="mt-4">
              <PageHeader title="404 - Page not Found" />
              <div className="space-y-1.5">
                <p className="text-muted-foreground text-base">
                  It looks like you followed a broken link or mistyped a URL.
                  Don’t worry, let’s get you back on track.
                </p>
                <Button onClick={() => router.back()} className="w-full">
                  Go back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
