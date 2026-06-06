import { ComingSoon } from "@/components/ComingSoon";
import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconAward,
  IconFileDescription,
  IconSchool,
} from "@tabler/icons-react";
import React from "react";

export const StaffSalary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 relative">
        <ComingSoon />
        <div className="rounded-md flex gap-1 text-sm items-center justify-between bg-muted/50 px-3 py-3 space-y-1">
          <span className="text-muted-foreground">Basic Salary</span>
          <span>
            <NairaIcon />
            250,000
          </span>
        </div>
        <div className="rounded-md flex gap-1 text-sm items-center justify-between bg-muted/50 px-3 py-3 space-y-1">
          <span className="text-muted-foreground">Allowances</span>
          <span>
            <NairaIcon />
            70,000
          </span>
        </div>
        <Separator />
        <div className="rounded-md flex gap-1 text-sm items-center justify-between bg-primary/10 text-primary px-3 py-4 space-y-1">
          <span className="text-black dark:text-white">
            Total Monthly Salary
          </span>
          <span>
            <NairaIcon />
            370,000
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
