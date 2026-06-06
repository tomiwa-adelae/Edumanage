"use client";
import { useAuth } from "@/store/useAuth";
import { TwoFactorSettings } from "./TwoFactorSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconLock } from "@tabler/icons-react";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ComingSoon } from "./ComingSoon";

export const SecuritySettings = () => {
  const { user } = useAuth();

  // Check if user is school admin
  const isSchoolAdmin =
    user?.role === "SCHOOLADMIN" ||
    user?.role === "ADMINISTRATOR" ||
    user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication Settings */}
      <TwoFactorSettings
        userId={user?.id || ""}
        schoolId={user?.school?.id || undefined}
        isSchoolAdmin={isSchoolAdmin}
      />

      {/* Other Security Settings (IP Whitelisting, etc.) */}
      {isSchoolAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-start gap-2">
              <IconLock className="text-primary size-4" />
              Additional Security
            </CardTitle>
            <CardDescription>
              Configure additional security features
            </CardDescription>
          </CardHeader>
          <CardContent className="relative mt-4 space-y-4">
            <ComingSoon />
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-medium flex items-center justify-start gap-2">
                  <IconLock className="size-4" />
                  IP Whitelisting
                </p>
                <p className="text-muted-foreground text-sm">
                  Restrict access to approved IP addresses
                </p>
              </div>
              <Switch disabled />
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Additional security features coming soon...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
