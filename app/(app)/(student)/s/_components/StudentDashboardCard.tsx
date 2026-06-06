import { Badge } from "@/components/ui/badge";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatDate } from "@/lib/utils";
import {
  IconAlertCircle,
  IconBuilding,
  IconCalendar,
  IconCircleCheck,
  IconClock,
  IconMail,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  desiredClass: any;
  appliedDate: string | undefined | null;
  image: string | undefined | null;
  candidateNumber: string | undefined;
  applicationStatus: string | undefined;
}

export const StudentDashboardCard = ({
  firstName,
  lastName,
  email,
  appliedDate,
  desiredClass,
  candidateNumber,
  image,
  applicationStatus,
}: Props) => {
  return (
    <div className="rounded-md shadow bg-muted p-6 relative">
      <div className="flex items-start md:items-center justify-start gap-2">
        <UserProfilePicture
          src={image}
          alt={`${firstName}'s picture`}
          size="md"
        />
        <div className="flex-1">
          <h2 className="Font-medium text-lg md:text-2xl">
            {firstName} {lastName}
          </h2>
          <p className="text-muted-foreground text-sm">
            Candidate No.: {candidateNumber}
          </p>
          <div className="hidden mt-2 md:grid grid-cols-1 lg:grid-cols-3 gap-1 text-muted-foreground text-sm">
            <p className="flex items-center justify-start gap-1">
              <IconBuilding className="size-4" /> Applied for:{" "}
              {desiredClass || "No class"}
            </p>
            <p className="flex items-center justify-start gap-1">
              <IconCalendar className="size-4" /> Applied:{" "}
              {formatDate(appliedDate)}
            </p>
            <a
              href={`mailto:${email}`}
              className="flex w-full hover:underline hover:text-primary items-center justify-start gap-1"
            >
              <IconMail className="size-4" /> {email}
            </a>
          </div>
        </div>
        <Badge
          variant={
            applicationStatus === "pending"
              ? "pending"
              : applicationStatus === "rejected"
              ? "destructive"
              : "default"
          }
          className="absolute top-4 right-4"
        >
          {applicationStatus === "pending" ? (
            <>
              <IconClock />
              Pending
            </>
          ) : applicationStatus === "rejected" ? (
            <>
              <IconAlertCircle />
              Rejected
            </>
          ) : (
            <>
              <IconCircleCheck />
              Approved
            </>
          )}
        </Badge>
      </div>
      <div className="mt-2 md:hidden grid grid-cols-1 lg:grid-cols-3 gap-1 text-muted-foreground text-sm">
        <p className="flex items-center justify-start gap-1">
          <IconBuilding className="size-4" /> Applied for:{" "}
          {desiredClass || "No class"}
        </p>
        <p className="flex items-center justify-start gap-1">
          <IconCalendar className="size-4" /> Applied: {formatDate(appliedDate)}
        </p>
        <a
          href={`mailto:${email}`}
          className="flex w-full hover:underline hover:text-primary items-center justify-start gap-1"
        >
          <IconMail className="size-4" /> {email}
        </a>
      </div>
    </div>
  );
};
