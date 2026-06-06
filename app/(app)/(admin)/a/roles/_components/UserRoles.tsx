import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/store/useAuth";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatPhoneNumber, formatWord } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  IconEdit,
  IconPencil,
  IconPhone,
  IconRestore,
  IconUser,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { NothingFound } from "@/components/NothingFound";
import { RoleModal } from "@/components/RoleModal";

interface Props {
  users: User[];
  onRefresh: () => void;
  jobRoles: {
    id: string;
    name: string;
  }[];
}

export const UserRoles = ({ users, onRefresh, jobRoles }: Props) => {
  const [openRoleModal, setOpenRoleModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>User roles & managements</CardTitle>
        <CardDescription>
          View and manage roles for all users in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchBarWrapper placeholder="Search users by name, email, role..." />
        {users.length === 0 && <NothingFound message="No user found..." />}

        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department/Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserProfilePicture src="" alt="" size="default" />
                      <div>
                        <div className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <a
                          href={`mailto:${user?.email}`}
                          className="text-muted-foreground mt-0.5 text-xs hover:underline hover:text-primary"
                        >
                          {user?.email}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`tel:${user?.phoneNumber}`}
                      className="hover:underline hover:text-primary flex items-center justify-start"
                    >
                      <IconPhone className="inline-block size-5" />{" "}
                      <span>
                        {formatPhoneNumber(user?.phoneNumber) || (
                          <span className="italic ml-1">No phone</span>
                        )}
                      </span>
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-1 items-center">
                      {user?.schoolRoles && user.schoolRoles.length > 0 ? (
                        <>
                          {user.schoolRoles.slice(0, 1).map((r, idx) => (
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
                                  : "outlinePurple"
                              }
                            >
                              {formatWord[r.role]}
                            </Badge>
                          ))}
                          {user.schoolRoles.length > 1 && (
                            <Badge variant="outline">{`+${
                              user.schoolRoles.length - 1
                            }`}</Badge>
                          )}
                        </>
                      ) : (
                        <Badge
                          variant={
                            user?.role === "ADMINISTRATOR"
                              ? "admin"
                              : user?.role === "STUDENT"
                              ? "student"
                              : user?.role === "PARENT"
                              ? "parent"
                              : user?.role === "TEACHER"
                              ? "teacher"
                              : user?.role === "EXAM_OFFICER"
                              ? "exam_officer"
                              : user?.role === "LIBRARIAN"
                              ? "librarian"
                              : user?.role === "BURSAR"
                              ? "bursar"
                              : user?.role === "DATA_ANALYST"
                              ? "data_analyst"
                              : user?.role === "IT_SUPPORT"
                              ? "it_support"
                              : user?.role === "PRINCIPAL"
                              ? "principal"
                              : "outlinePurple"
                          }
                        >
                          {formatWord[user?.role!]}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user?.role === "TEACHER" && user?.Teacher?.classes && (
                      <>
                        {user.Teacher.classes.slice(0, 1).map((c, index) => (
                          <Badge key={index} variant="secondary">
                            {c.level}
                            {c.section}
                          </Badge>
                        ))}

                        {user.Teacher.classes.length > 1 && (
                          <Badge variant="secondary">
                            +{user.Teacher.classes.length - 1}
                          </Badge>
                        )}
                        {user.Teacher.classes.length === 0 && (
                          <Badge variant={"secondary"}>No class</Badge>
                        )}
                      </>
                    )}
                    {user?.role === "STUDENT" && (
                      <Badge variant="secondary">
                        {user?.Student.Class.level}
                        {user?.Student?.Class.section}
                      </Badge>
                    )}
                    {user?.role === "ADMINISTRATOR" && "Administration"}
                    {user?.role === "PRINCIPAL" && "Administration"}
                    {user?.role === "BURSAR" && "Finances"}
                    {user?.role === "LIBRARIAN" && "Library Services"}
                    {user?.role === "COUNSELOR" && "Library Student Services"}
                    {user?.role === "PARENT" && "Parent"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={"outlineSuccess"}>Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenRoleModal(true);
                      }}
                      variant={"secondary"}
                      size="icon"
                    >
                      <IconPencil />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden space-y-4">
          {users?.map((user, index) => (
            <div key={index} className="space-y-4 border-b last:border-0 pb-4">
              {/* Top row: profile + actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1">
                  <UserProfilePicture src="" alt="" size="default" />
                  <div className="flex-1">
                    <div className="font-medium text-base line-clamp-1">
                      {user?.firstName} {user?.lastName}{" "}
                    </div>
                    <a
                      href={`mailto:${user?.email}`}
                      className="text-sm text-muted-foreground inline-block hover:text-primary hover:underline line-clamp-1"
                    >
                      {user?.email}
                    </a>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenRoleModal(true);
                  }}
                  variant="secondary"
                  size="icon"
                >
                  <IconPencil />
                </Button>
              </div>

              {/* Bottom row: details */}
              <div className="text-sm text-muted-foreground space-y-2">
                {/* Contact */}
                <div className="flex items-center justify-between gap-1">
                  <p className="flex items-center gap-1">
                    <IconPhone className="inline-block size-4.5" />
                    {user?.phoneNumber ? (
                      <a
                        href={`tel:${user?.phoneNumber}`}
                        className="hover:underline hover:text-primary"
                      >
                        {formatPhoneNumber(user?.phoneNumber)}
                      </a>
                    ) : (
                      <span className="italic">No phone</span>
                    )}
                  </p>
                  <span>
                    <IconUser className="inline-block size-4.5" />
                    {user?.employeeID || (
                      <span className="italic">No employee ID</span>
                    )}
                  </span>
                </div>
                {/* Role & Department/Class */}
                <p className="flex justify-between items-center gap-1">
                  <div className="flex justify-start gap-1 items-center">
                    {user?.schoolRoles && user.schoolRoles.length > 0 ? (
                      <>
                        {user.schoolRoles.slice(0, 1).map((r, idx) => (
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
                                : "outlinePurple"
                            }
                          >
                            {formatWord[r.role]}
                          </Badge>
                        ))}
                        {user.schoolRoles.length > 1 && (
                          <Badge variant="outline">{`+${
                            user.schoolRoles.length - 1
                          }`}</Badge>
                        )}
                      </>
                    ) : (
                      <Badge
                        variant={
                          user?.role === "ADMINISTRATOR"
                            ? "admin"
                            : user?.role === "STUDENT"
                            ? "student"
                            : user?.role === "PARENT"
                            ? "parent"
                            : user?.role === "TEACHER"
                            ? "teacher"
                            : "outlinePurple"
                        }
                      >
                        {formatWord[user?.role!]}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-start gap-1 items-center">
                    {user?.role === "TEACHER" && user?.Teacher?.classes && (
                      <>
                        {user?.Teacher.classes.slice(0, 1).map((c, idx) => (
                          <Badge key={idx} variant="secondary">
                            {c.level}
                            {c.section}
                          </Badge>
                        ))}
                        {user?.Teacher.classes.length > 1 && (
                          <Badge variant="secondary">
                            +{user?.Teacher.classes.length - 1}
                          </Badge>
                        )}
                        {user?.Teacher.classes.length === 0 && (
                          <Badge variant="secondary">No class</Badge>
                        )}
                      </>
                    )}
                    {user?.role === "STUDENT" && user?.Student?.Class && (
                      <Badge variant="secondary">
                        {user?.Student.Class.level}
                        {user?.Student.Class.section}
                      </Badge>
                    )}
                    {user?.role === "ADMINISTRATOR" && "Administration"}
                    {user?.role === "PRINCIPAL" && "Administration"}
                    {user?.role === "BURSAR" && "Finances"}
                    {user?.role === "LIBRARIAN" && "Library Services"}
                    {user?.role === "COUNSELOR" && "Library Student Services"}
                    {user?.role === "PARENT" && "Parent"}
                  </div>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {selectedUser && openRoleModal && (
        <RoleModal
          firstName={selectedUser?.firstName}
          lastName={selectedUser?.lastName}
          staffId={selectedUser?.id}
          open={openRoleModal}
          jobRoles={jobRoles}
          role={selectedUser?.role}
          schoolRoles={selectedUser?.schoolRoles}
          onClose={() => {
            setOpenRoleModal(false);
            onRefresh();
          }}
        />
      )}
    </Card>
  );
};
