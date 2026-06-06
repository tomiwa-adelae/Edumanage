import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassSubject } from "./ClassSubject";

export const ClassSubjects = () => {
  return (
    <Card className="gap-2.5">
      <CardHeader>
        <CardTitle>Class Subjects & Teachers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchBarWrapper />
        <div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Subject Name</TableHead>
                <TableHead>Subject Teacher.</TableHead>
                <TableHead>Hours/Week</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ClassSubject />
              <ClassSubject />
              <ClassSubject />
              <ClassSubject />
              <ClassSubject />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
