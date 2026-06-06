import { ComingSoon } from "@/components/ComingSoon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconAward,
  IconFileDescription,
  IconSchool,
} from "@tabler/icons-react";
import React from "react";

export const StaffCertifications = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-1">
          <IconFileDescription className="text-primary size-4" />
          Professional Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-2 relative">
        <ComingSoon />
        <div className="rounded-md border flex gap-1 text-sm items-center justify-start px-3 py-4 space-y-1">
          <IconAward className="size-5 text-primary" />
          <span>Nigeria Certificate in Education (NCE)</span>
        </div>
        <div className="rounded-md border flex gap-1 text-sm items-center justify-start px-3 py-4 space-y-1">
          <IconAward className="size-5 text-primary" />
          <span>Teachers Registration Council (TRCN) Certified</span>
        </div>
        <div className="rounded-md border flex gap-1 text-sm items-center justify-start px-3 py-4 space-y-1">
          <IconAward className="size-5 text-primary" />
          <span>
            Cambridge International Certificate in Teaching and Learning
          </span>
        </div>
        <div className="rounded-md border flex gap-1 text-sm items-center justify-start px-3 py-4 space-y-1">
          <IconAward className="size-5 text-primary" />
          <span>First Aid and Safety Training</span>
        </div>
      </CardContent>
    </Card>
  );
};
