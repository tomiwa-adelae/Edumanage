import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconCalendar,
  IconLocation,
  IconMap2,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  location?: string | null;
  academicYear?: string | null;
  capacity: string | null;
}

export const ClassInformationBox = ({
  location,
  academicYear,
  capacity,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Information</CardTitle>
      </CardHeader>

      <CardContent
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-4",
          location && "lg:grid-cols-3"
        )}
      >
        {location && (
          <div className="flex items-start justify-start gap-2 text-muted-foreground">
            <IconMapPin className="size-4.5" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Classroom location
              </p>
              <p className="text-base font-medium text-black dark:text-white">
                {location}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start justify-start gap-2 text-muted-foreground">
          <IconCalendar className="size-4.5" />
          <div className="space-y-1">
            <p className="text-sm">Academic Year</p>
            <p className="font-medium text-base text-black dark:text-white">
              {" "}
              {academicYear}
            </p>
          </div>
        </div>
        <div className="flex items-start justify-start gap-2 text-muted-foreground">
          <IconUsers className="size-4.5" />
          <div className="space-y-1">
            <p className="text-sm">Class Capacity</p>
            <p className="font-medium text-base text-black dark:text-white">
              {" "}
              {capacity}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
