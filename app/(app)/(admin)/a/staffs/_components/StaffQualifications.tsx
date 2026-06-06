import { ComingSoon } from "@/components/ComingSoon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconAward, IconSchool } from "@tabler/icons-react";
import React from "react";

export const StaffQualifications = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-1">
          <IconSchool className="text-primary size-4" />
          Academic Qualifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <ComingSoon />
        <div className="rounded-md border px-3 py-4 space-y-1">
          <div>
            <p className="text-base flex items-center justify-between gap-2 font-medium">
              <span>B.Sc. Mathematics</span>
              <Badge variant={"outline"}>2008</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              University of Ibadan
            </p>
          </div>

          <p className="text-muted-foreground text-sm flex items-center justify-start gap-1">
            <IconAward className="size-4" />
            Second Class Upper
          </p>
        </div>
        <div className="rounded-md border px-3 py-4 space-y-1">
          <div>
            <p className="text-base flex items-center justify-between gap-2 font-medium">
              <span>B.Sc. Mathematics</span>
              <Badge variant={"outline"}>2008</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              University of Ibadan
            </p>
          </div>

          <p className="text-muted-foreground text-sm flex items-center justify-start gap-1">
            <IconAward className="size-4" />
            Second Class Upper
          </p>
        </div>
        <div className="rounded-md border px-3 py-4 space-y-1">
          <div>
            <p className="text-base flex items-center justify-between gap-2 font-medium">
              <span>B.Sc. Mathematics</span>
              <Badge variant={"outline"}>2008</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              University of Ibadan
            </p>
          </div>

          <p className="text-muted-foreground text-sm flex items-center justify-start gap-1">
            <IconAward className="size-4" />
            Second Class Upper
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
