import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatPhoneNumber, formatWord } from "@/lib/utils";
import { Class, User } from "@/store/useAuth";
import { IconPhone } from "@tabler/icons-react";
import { StaffActions } from "./StaffActions";
import Link from "next/link";

interface Props {
  staff: User | null;
}

export const StaffRow = ({ staff }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserProfilePicture src="" alt="" size="default" />
          <div>
            <Link
              href={`/a/staffs/${staff?.username || staff?.id}`}
              className="font-medium hover:underline block hover:text-primary"
            >
              {staff?.firstName} {staff?.lastName}
            </Link>
            <a
              href={`mailto:${staff?.email}`}
              className="text-muted-foreground mt-0.5 text-xs hover:underline hover:text-primary"
            >
              {staff?.email}
            </a>
          </div>
        </div>
      </TableCell>
      <TableCell>{staff?.employeeID || <span>No employee ID</span>}</TableCell>
      <TableCell>
        <div className="flex justify-start gap-1 items-center">
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
      </TableCell>
      <TableCell>
        <a
          href={`tel:${staff?.phoneNumber}`}
          className="hover:underline hover:text-primary flex items-center justify-start"
        >
          <IconPhone className="inline-block size-5" />{" "}
          <span>
            {formatPhoneNumber(staff?.phoneNumber) || (
              <span className="italic ml-1">No phone</span>
            )}
          </span>
        </a>
      </TableCell>
      <TableCell>
        <Badge variant={"outlineSuccess"}>Active</Badge>
      </TableCell>
      <TableCell>
        {staff?.role === "TEACHER" && staff?.Teacher?.assignments && (
          <>
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
          </>
        )}
        {staff?.role === "ADMINISTRATOR" && "Administration"}
        {staff?.role === "PRINCIPAL" && "Administration"}
        {staff?.role === "BURSAR" && "Finances"}
        {staff?.role === "LIBRARIAN" && "Library Services"}
        {staff?.role === "COUNSELOR" && "Library Student Services"}
      </TableCell>
      <TableCell className="text-right">
        <StaffActions id={staff?.id} username={staff?.username} />
      </TableCell>
    </TableRow>
  );
};
