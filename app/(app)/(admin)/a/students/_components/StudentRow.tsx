import { StudentActions } from "@/components/StudentActions";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Student, User } from "@/store/useAuth";
import Link from "next/link";

interface Props {
  student: User;
}

export const StudentRow = ({ student }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserProfilePicture
            src={student?.image}
            alt={`${student?.firstName}'s picture`}
          />
          <div>
            <Link
              href={`/a/students/${student?.username}`}
              className="font-medium hover:underline hover:text-primary block"
            >
              {student?.firstName} {student?.lastName} {student?.otherName}
            </Link>
            <a
              href={`mailto:${student?.email}`}
              className="hover:text-primary hover:underline text-muted-foreground mt-0.5 text-xs"
            >
              {student?.email}
            </a>
          </div>
        </div>
      </TableCell>
      <TableCell>{student?.Student.admissionNumber}</TableCell>
      <TableCell>
        {student?.Student.Class.level}
        {student?.Student.Class.section}
      </TableCell>
      <TableCell>
        <Badge variant={"outlineSuccess"}>Active</Badge>
      </TableCell>
      <TableCell className="text-right">
        <StudentActions
          lastName={student?.lastName!}
          firstName={student?.firstName!}
          image={student?.image!}
          email={student?.email!}
          role={student?.role!}
          username={student?.username!}
          studentId={student?.id!}
        />
      </TableCell>
    </TableRow>
  );
};
