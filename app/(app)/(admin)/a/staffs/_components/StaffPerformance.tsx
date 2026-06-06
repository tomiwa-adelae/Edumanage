import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Class } from "@/store/useAuth";
import React from "react";

interface Props {
  classes: Class[] | undefined;
}

export const StaffPerformance = ({ classes }: Props) => {
  const totalStudents = classes?.reduce(
    (acc, cls) => acc + cls.students.length,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="rounded-md p-3 bg-primary/10 flex items-center justify-center flex-col">
          <p className="text-muted-foreground text-sm">Classes</p>
          <p className="text-base font-medium text-primary">
            {classes?.length}
          </p>
        </div>
        <div className="rounded-md p-3 bg-green-500/10 flex items-center justify-center flex-col">
          <p className="text-muted-foreground text-sm">Students</p>
          <p className="text-base font-medium text-green-500">
            {totalStudents}
          </p>
        </div>
        <div className="rounded-md p-3 bg-purple-500/10 flex items-center justify-center flex-col">
          <p className="text-muted-foreground text-sm">Avg. Score</p>
          <p className="text-base font-medium text-purple-500">3</p>
        </div>
        <div className="rounded-md p-3 bg-orange-500/10 flex items-center justify-center flex-col">
          <p className="text-muted-foreground text-sm">Attendance</p>
          <p className="text-base font-medium text-orange-500">3</p>
        </div>
      </CardContent>
    </Card>
  );
};
