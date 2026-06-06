import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatDate, formatWord } from "@/lib/utils";
import { SchoolRoles } from "@/store/useAuth";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  employeeID: string | null;
  role: string;
  image: string | null;
  title: string | null | undefined;
  dob: string | null;
  joinedDate: string | null;
  schoolRoles: SchoolRoles[];
}

export const StaffProfile = ({
  firstName,
  lastName,
  employeeID,
  role,
  image,
  title,
  email,
  dob,
  joinedDate,
  schoolRoles,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <UserProfilePicture
            size="lg"
            src={image}
            alt={`${firstName}'s picture`}
          />
          <div className="space-y-1.5">
            <p className="text-base lg:text-lg font-medium">
              {title} {firstName} {lastName}
            </p>
            <p className="text-muted-foreground text-sm">
              {employeeID || (
                <a
                  href={`mailto:${email}`}
                  className="hover:underline hover:text-primary"
                >
                  {email}
                </a>
              )}
            </p>
            <div className="flex items-center flex-wrap justify-center gap-1">
              {schoolRoles.length > 1 ? (
                schoolRoles.map((r) => (
                  <Badge
                    variant={
                      r?.role === "ADMINISTRATOR"
                        ? "admin"
                        : r?.role === "STUDENT"
                        ? "student"
                        : r?.role === "PARENT"
                        ? "parent"
                        : r?.role === "TEACHER"
                        ? "teacher"
                        : r?.role === "EXAM_OFFICER"
                        ? "exam_officer"
                        : r?.role === "LIBRARIAN"
                        ? "librarian"
                        : r?.role === "BURSAR"
                        ? "bursar"
                        : r?.role === "DATA_ANALYST"
                        ? "data_analyst"
                        : r?.role === "IT_SUPPORT"
                        ? "it_support"
                        : r?.role === "PRINCIPAL"
                        ? "principal"
                        : "outlinePurple"
                    }
                  >
                    {formatWord[r.role]}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant={
                    role === "ADMINISTRATOR"
                      ? "admin"
                      : role === "STUDENT"
                      ? "student"
                      : role === "PARENT"
                      ? "parent"
                      : role === "TEACHER"
                      ? "teacher"
                      : role === "EXAM_OFFICER"
                      ? "exam_officer"
                      : role === "LIBRARIAN"
                      ? "librarian"
                      : role === "BURSAR"
                      ? "bursar"
                      : role === "DATA_ANALYST"
                      ? "data_analyst"
                      : role === "IT_SUPPORT"
                      ? "it_support"
                      : role === "PRINCIPAL"
                      ? "principal"
                      : "outlinePurple"
                  }
                >
                  {formatWord[role]}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4 text-muted-foreground text-sm">
          <div className="flex items-start justify-start gap-2">
            <IconBuilding className="size-5" />
            <div>
              <p className="text-xs">Department</p>
              <p className="text-black dark:text-white font-medium">Science</p>
            </div>
          </div>
          <div className="flex items-start justify-start gap-2">
            <IconBriefcase className="size-5" />
            <div>
              <p className="text-xs">Employee Number</p>
              <p className="text-black dark:text-white font-medium">
                {employeeID || <span className="italic">No employee ID</span>}
              </p>
            </div>
          </div>
          <div className="flex items-start justify-start gap-2">
            <IconCalendar className="size-5" />
            <div>
              <p className="text-xs">Date of Birth</p>
              <p className="text-black dark:text-white font-medium">
                {dob ? (
                  formatDate(dob)
                ) : (
                  <span className="italic">No date of birth</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start justify-start gap-2">
            <IconClock className="size-5" />
            <div>
              <p className="text-xs">Joined Date</p>
              <p className="text-black dark:text-white font-medium">
                {formatDate(joinedDate)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
