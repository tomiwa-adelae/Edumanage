import { Badge } from "@/components/ui/badge";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatPhoneNumber, formatWord } from "@/lib/utils";
import { Class, User } from "@/store/useAuth";
import { IconPhone, IconUser } from "@tabler/icons-react";
import React from "react";
import { StaffActions } from "./StaffActions";
import Link from "next/link";

interface Props {
  staff: User | null;
}

export const StaffCard = ({ staff }: Props) => {
  return (
    <div className="space-y-4 border-b last:border-0 pb-4">
      <div className="flex items-center justify-start gap-2">
        <UserProfilePicture src="" alt="" size="default" />
        <div className="flex-1">
          <Link
            href={`/a/staffs/${staff?.username || staff?.id}`}
            className="font-medium text-base line-clamp-1 hover:underline hover:text-primary"
          >
            {staff?.firstName} {staff?.lastName}{" "}
            <Badge variant={"outlineSuccess"}>Active</Badge>
          </Link>
          <a
            className="hover:text-primary inline-block text-sm text-muted-foreground hover:underline transition-all line-clamp-1"
            href={`mailto:${staff?.email}`}
          >
            {staff?.email}
          </a>
        </div>
        <StaffActions username={staff?.username} id={staff?.id} />
      </div>
      <div className="text-sm text-muted-foreground space-y-2">
        <p className="flex items-center justify-between gap-1">
          <span>
            {staff?.role === "TEACHER" && staff?.Teacher?.assignments && (
              <div className="flex gap-1">
                {staff.Teacher.assignments.slice(0, 1).map((a, index) => (
                  <Badge key={index} variant="secondary">
                    {a.Subject.name}
                  </Badge>
                ))}

                {staff.Teacher.assignments.length > 1 && (
                  <Badge variant="secondary">
                    +{staff.Teacher.assignments.length - 1}
                  </Badge>
                )}
                {staff.Teacher.assignments.length === 0 && (
                  <Badge variant={"secondary"}>No subject</Badge>
                )}
              </div>
            )}
            {staff?.role === "ADMINISTRATOR" && "Administration"}
            {staff?.role === "PRINCIPAL" && "Administration"}
            {staff?.role === "BURSAR" && "Finances"}
            {staff?.role === "LIBRARIAN" && "Library Services"}
            {staff?.role === "COUNSELOR" && "Library Student Services"}
            {staff?.role === "PARENT" && "Parent"}
          </span>
          {/* <Badge variant={"outlinePurple"}>{formatWord[staff?.role!]}</Badge> */}
          {/* {staff && staff?.schoolRoles?.length > 1 ? (
            <div className="flex justify-end gap-1 items-center">
              {staff?.schoolRoles?.map((r) => (
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
                      : "outlinePurple"
                  }
                >
                  {formatWord[r.role]}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge
              variant={
                staff?.role === "ADMINISTRATOR"
                  ? "admin"
                  : staff?.role === "STUDENT"
                  ? "student"
                  : staff?.role === "PARENT"
                  ? "parent"
                  : staff?.role === "TEACHER"
                  ? "teacher"
                  : "outlinePurple"
              }
            >
              {formatWord[staff?.role!]}
            </Badge>
          )} */}
          <div className="flex justify-end gap-1 items-center">
            {staff?.schoolRoles && staff.schoolRoles.length > 0 ? (
              <>
                {staff.schoolRoles.slice(0, 1).map((r, idx) => (
                  <Badge
                    key={idx}
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
                ))}
                {staff.schoolRoles.length > 1 && (
                  <Badge variant="outline">{`+${
                    staff.schoolRoles.length - 1
                  }`}</Badge>
                )}
              </>
            ) : (
              <Badge
                variant={
                  staff?.role === "ADMINISTRATOR"
                    ? "admin"
                    : staff?.role === "STUDENT"
                    ? "student"
                    : staff?.role === "PARENT"
                    ? "parent"
                    : staff?.role === "TEACHER"
                    ? "teacher"
                    : staff?.role === "EXAM_OFFICER"
                    ? "exam_officer"
                    : staff?.role === "LIBRARIAN"
                    ? "librarian"
                    : staff?.role === "BURSAR"
                    ? "bursar"
                    : staff?.role === "DATA_ANALYST"
                    ? "data_analyst"
                    : staff?.role === "IT_SUPPORT"
                    ? "it_support"
                    : staff?.role === "PRINCIPAL"
                    ? "principal"
                    : "outlinePurple"
                }
              >
                {formatWord[staff?.role!]}
              </Badge>
            )}
          </div>
        </p>
        <p className="flex items-center justify-between gap-1">
          <span>
            <IconUser className="inline-block size-4.5" />
            {staff?.employeeID || (
              <span className="italic">No employee ID</span>
            )}
          </span>
          <a
            className="hover:text-primary hover:underline transition-all flex items-center justify-start"
            href={`tel:${staff?.phoneNumber}`}
          >
            <IconPhone className="inline-block size-4.5" />{" "}
            {staff?.phoneNumber ? (
              formatPhoneNumber(staff?.phoneNumber)
            ) : (
              <span className="italic">No phone</span>
            )}
          </a>
        </p>
      </div>
    </div>
  );
};
