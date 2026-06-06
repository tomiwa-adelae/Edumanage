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

export const StaffBankDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 relative">
        <ComingSoon />
        <div className="rounded-md text-sm px-3 py-3 space-y-1">
          <p className="text-muted-foreground text-xs">Bank Name</p>
          <p>First Bank of Nigeria</p>
        </div>
        <div className="rounded-md text-sm px-3 py-3 space-y-1">
          <p className="text-muted-foreground text-xs">Account Number</p>
          <p>2143463056</p>
        </div>
        <div className="rounded-md text-sm px-3 py-3 space-y-1">
          <p className="text-muted-foreground text-xs">Account Name</p>
          <p>Oluwaseun Tunde Adeyemi</p>
        </div>
      </CardContent>
    </Card>
  );
};
