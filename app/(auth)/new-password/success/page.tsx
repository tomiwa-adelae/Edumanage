import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconArrowRight,
  IconCheck,
  IconRosetteDiscountCheckFilled,
  IconShield,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FullLogo } from "../../_components/Logo";
import { maskEmail } from "@/lib/utils";
import { authMetadata } from "@/lib/metadata";

export const metadata = authMetadata.passwordSuccess;

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
      <Card className="bg-white dark:bg-card md:min-w-md">
        <CardContent className="space-y-10 py-6">
          <div className="space-y-3 text-center">
            <div
              className={
                "rounded-full p-4 bg-green-500/20 text-green-500 mx-auto inline-flex"
              }
            >
              <IconRosetteDiscountCheckFilled className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-2xl md:text-3xl text-green-800">
                Password Reset Complete!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully updated for{" "}
                <span className="font-medium">{maskEmail(email)}</span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-md bg-green-500/5 text-green-800 p-4 border border-green-300">
              <h3 className="font-medium text-sm flex items-center justify-start">
                <IconShield className="inline-block mr-1 size-4" />
                <span>Security Features Applied</span>
              </h3>
              <div className="mt-1.5 space-y-1 text-xs">
                <p>✓ Password encrypted and securely stored</p>
                <p>✓ All active sessions have been terminated</p>
                <p>✓ Login activity will be monitored</p>
              </div>
            </div>
            <div className="rounded-md bg-primary/10 text-primary p-4 border border-primary">
              <h3 className="font-medium text-sm flex items-center justify-start">
                <IconShield className="inline-block mr-1 size-4" />
                <span>What's Next?</span>
              </h3>
              <div className="mt-1.5 space-y-1 text-xs">
                <p>• Sign in with your new password</p>
                <p>• Update your password manager if you use one</p>
                <p>• Consider enabling two-factor authentication</p>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/">
                Sign in Now <IconArrowRight />
              </Link>
            </Button>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Having trouble signing in?{" "}
              <Link
                href="/contact"
                className="hover:underline text-primary font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
