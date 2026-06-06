import React from "react";
import { StudentCard } from "./StudentCard";
import { User } from "@/store/useAuth";

interface Props {
  students: User[];
}

export const StudentsCard = ({ students }: Props) => {
  return (
    <div className="md:hidden space-y-4">
      {students.map((student) => (
        <StudentCard key={student?.id} student={student} />
      ))}
    </div>
  );
};
