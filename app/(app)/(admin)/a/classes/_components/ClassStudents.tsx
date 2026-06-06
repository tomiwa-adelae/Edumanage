import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/store/useAuth";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Badge } from "@/components/ui/badge";
import { StudentActions } from "@/components/StudentActions";
import { IconPhone, IconUser } from "@tabler/icons-react";
import { formatPhoneNumber } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { NothingFound } from "@/components/NothingFound";

interface Props {
  students: Student[];
}

export const ClassStudents = ({ students }: Props) => {
  return (
    <Card className="gap-2.5">
      <CardHeader>
        <CardTitle>Class students</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchBarWrapper />
        {students.length === 0 && <NothingFound message="No students found" />}
        {students.length !== 0 && (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserProfilePicture />
                          <div>
                            <Link
                              href={`/a/students/${student?.user?.username}`}
                              className="font-medium hover:underline hover:text-primary block"
                            >
                              {student?.user?.firstName}{" "}
                              {student?.user?.lastName}{" "}
                              {student?.user?.otherName}
                            </Link>
                            <a
                              href={`mailto:${student?.user?.email}`}
                              className="hover:text-primary hover:underline text-muted-foreground mt-0.5 text-xs"
                            >
                              {student?.user?.email}
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student?.admissionNumber}</TableCell>
                      <TableCell>{student?.user?.gender}</TableCell>
                      <TableCell>
                        <Badge variant={"outlineSuccess"}>Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <StudentActions
                          lastName={student?.user?.lastName!}
                          firstName={student?.user?.firstName!}
                          image={student?.user?.image!}
                          email={student?.user?.email!}
                          role={student?.user?.role!}
                          username={student?.user?.username!}
                          studentId={student?.user?.id!}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden space-y-4">
              {students.map((student) => (
                <div
                  key={student?.id}
                  className="space-y-4 border-b last:border-0 pb-4"
                >
                  <div className="flex items-center justify-start gap-2">
                    <UserProfilePicture />
                    <div className="flex-1">
                      <h3 className="font-medium text-base line-clamp-1">
                        {student?.user?.title} {student?.user?.lastName}{" "}
                        {student?.user?.otherName}
                        <Badge variant={"outlineSuccess"}>Active</Badge>
                      </h3>
                      <a
                        className="hover:text-primary text-sm text-muted-foreground hover:underline transition-all line-clamp-1"
                        href={`mailto:${student?.user?.email}`}
                      >
                        {student?.user?.email}
                      </a>
                    </div>
                    <StudentActions
                      lastName={student?.user?.lastName!}
                      firstName={student?.user?.firstName!}
                      image={student?.user?.image!}
                      email={student?.user?.email!}
                      role={student?.user?.role!}
                      username={student?.user?.username!}
                      studentId={student?.user?.id!}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <span>
                        {student?.Class.level} - Section{" "}
                        {student?.Class.section}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-1">
                      <span>
                        <IconUser className="inline-block size-4.5" />
                        {student?.admissionNumber}
                      </span>
                      <a
                        className="transition-all flex items-center justify-start hover:underline hover:text-primary"
                        href={`tel:${student?.user?.phoneNumber}`}
                      >
                        <IconPhone className="inline-block size-4.5" />
                        {student?.user?.phoneNumber ? (
                          formatPhoneNumber(student?.user?.phoneNumber)
                        ) : (
                          <span className="italic">No phone</span>
                        )}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
