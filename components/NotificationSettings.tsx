"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { IconBell } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const NotificationSettings = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = (value: boolean) => {};
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-1">
          <IconBell className="text-primary size-4" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure how you receive system notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-medium">Email Notifications</p>
            <p className="text-muted-foreground text-sm">
              Receive notifications via email
            </p>
          </div>
          <Switch />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-medium">SMS Notifications</p>
            <p className="text-muted-foreground text-sm">
              Receive notifications via SMS
            </p>
          </div>
          <Switch />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-medium">Push Notifications</p>
            <p className="text-muted-foreground text-sm">
              Receive browser push notifications
            </p>
          </div>
          <Switch />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-medium">Attendance Alerts</p>
            <p className="text-muted-foreground text-sm">
              Get notified about attendance issues
            </p>
          </div>
          <Switch />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-medium">Fee Payment Reminders</p>
            <p className="text-muted-foreground text-sm">
              Notify about pending fee payments
            </p>
          </div>
          <Switch />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-medium">Grade Publication Alerts</p>
            <p className="text-muted-foreground text-sm">
              Notify when grades are published
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};
