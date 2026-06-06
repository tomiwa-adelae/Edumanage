import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatDate } from "@/lib/utils";
import {
  IconCalendar,
  IconDotsVertical,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { Dot } from "lucide-react";
import React from "react";

export const FeeCard = () => {
  return (
    <Card>
      <CardContent className="space-y-4 ">
        <div className="flex items-center justify-start gap-2">
          <UserProfilePicture />
          <div className="flex-1">
            <h3 className="font-medium text-base line-clamp-1">
              Tomiwa Adelae <Badge variant={"outlineSuccess"}>Paid</Badge>
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              STU20244001{" "}
              <Dot className="size-3 text-muted-foreground inline-block" /> JSS1
            </p>
          </div>
          <Button size="icon" variant={"secondary"}>
            <IconDotsVertical />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Tuition Fee</p>
          <p className="flex items-center justify-between gap-1">
            <span>
              <NairaIcon />
              15,000
            </span>
            <span>
              <IconCalendar className="inline-block size-4.5" />
              {formatDate(new Date())}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
