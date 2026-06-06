import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { StudentsTable } from "./StudentsTable";
import { StudentsCard } from "./StudentsCard";
import { User } from "@/store/useAuth";
import { NothingFound } from "@/components/NothingFound";

interface Props {
  students: User[];
}

export const StudentsLists = ({ students }: Props) => {
  return (
    <Card className="gap-0">
      <CardHeader>
        <h3 className="font-medium text-base">Students ({students.length})</h3>
      </CardHeader>
      <CardContent>
        {students.length === 0 && (
          <NothingFound message="No students found yet!" />
        )}
        {students.length !== 0 && (
          <>
            <StudentsTable students={students} />
            <StudentsCard students={students} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
