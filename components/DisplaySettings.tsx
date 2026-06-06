"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconDeviceLaptop, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export const DisplaySettings = () => {
  const { setTheme, theme } = useTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-1">
          <IconDeviceLaptop className="text-primary size-4" />
          Display Preferences
        </CardTitle>
        <CardDescription>Customize your interface appearance</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div>
          <p className="text-base font-medium">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="w-full"
            >
              <IconSun />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="w-full"
            >
              <IconMoon />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="w-full"
            >
              <IconDeviceLaptop />
              System
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
