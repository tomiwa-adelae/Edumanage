import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { User } from "@/store/useAuth";
import { NothingFound } from "@/components/NothingFound";
import { StudentActions } from "./StudentActions";
import Link from "next/link";
import { UserProfilePicture } from "@/components/UserProfilePicture";
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
import { Badge } from "@/components/ui/badge";

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
                    <TableRow key={student?.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserProfilePicture
                            src={student?.image}
                            alt={`${student?.firstName}'s picture`}
                          />
                          <div>
                            <Link
                              href={`/t/students/${student?.username}`}
                              className="font-medium hover:underline hover:text-primary block"
                            >
                              {student?.firstName} {student?.lastName}{" "}
                              {student?.otherName}
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
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden space-y-4">
              {students.map((student) => (
                <div className="space-y-4 border-b last:border-0 pb-4">
                  <div className="flex items-center justify-start gap-2">
                    <UserProfilePicture
                      src={student?.image}
                      alt={`${student?.firstName}'s picture`}
                    />
                    <div className="flex-1">
                      <Link
                        href={`/t/students/${student?.username}`}
                        className="font-medium hover:underline hover:text-primary text-base line-clamp-1"
                      >
                        {student?.firstName} {student?.lastName}{" "}
                        {student?.otherName}
                      </Link>
                      <a
                        className="hover:text-primary text-sm text-muted-foreground hover:underline transition-all line-clamp-1"
                        href={`mailto:${student?.email}`}
                      >
                        {student?.email}
                      </a>
                    </div>
                    <StudentActions
                      lastName={student?.lastName!}
                      firstName={student?.firstName!}
                      image={student?.image!}
                      email={student?.email!}
                      role={student?.role!}
                      username={student?.username!}
                      studentId={student?.id!}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <span>
                        {student?.Student.Class.level} - Section{" "}
                        {student?.Student.Class.section}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-1">
                      <span>
                        <IconUser className="inline-block size-4.5" />
                        {student?.Student.admissionNumber}
                      </span>
                      <a
                        className="hover:text-primary hover:underline transition-all flex items-center justify-start"
                        href={`tel:${student?.phoneNumber}`}
                      >
                        <IconPhone className="inline-block size-4.5" />
                        {student?.phoneNumber ? (
                          formatPhoneNumber(student?.phoneNumber)
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
