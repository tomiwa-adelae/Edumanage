import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentRow } from "./StudentRow";
import { Student, User } from "@/store/useAuth";

interface Props {
  students: User[];
}

export const StudentsTable = ({ students }: Props) => {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Admission No.</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <StudentRow student={student} key={student?.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
