"use client";
import { DeleteUserModal } from "@/components/DeleteUserModal";
import { ResetPasswordModal } from "@/components/ResetPasswordModal";
import { RoleModal } from "@/components/RoleModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolRoles } from "@/store/useAuth";
import {
  IconBan,
  IconKey,
  IconTrash,
  IconUser,
  IconUserQuestion,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  firstName: string;
  lastName: string;
  username: string;
  studentId: string;
  image: string | null;
  email: string;
  role: string;
  schoolRoles: SchoolRoles[];
  onRefresh: () => void;
}

export const QuickActions = ({
  firstName,
  username,
  lastName,
  studentId,
  image,
  email,
  role,
  schoolRoles,
  onRefresh,
}: Props) => {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button asChild className="justify-start" variant={"outline"}>
          <Link href={`/a/students/${username}/edit`}>
            <IconUser />
            Edit {firstName}'s details
          </Link>
        </Button>
        <Button className="justify-start" variant={"outline"}>
          <IconBan />
          Suspend {firstName}
        </Button>
        <Button
          onClick={() => setOpenResetPasswordModal(true)}
          className="justify-start"
          variant={"outline"}
        >
          <IconKey />
          Reset Password
        </Button>
        <Button
          onClick={() => setOpenDeleteUserModal(true)}
          className="justify-start"
          variant={"outlineDestructive"}
        >
          <IconTrash />
          Delete {firstName}'s account
        </Button>
      </CardContent>
      {openResetPasswordModal && (
        <ResetPasswordModal
          open={openResetPasswordModal}
          onClose={() => {
            setOpenResetPasswordModal(false);
          }}
          role={role}
          firstName={firstName}
          lastName={lastName}
          email={email}
          image={image}
          id={studentId}
        />
      )}
      {openDeleteUserModal && (
        <DeleteUserModal
          open={openDeleteUserModal}
          onClose={() => {
            setOpenDeleteUserModal(false);
          }}
          role={role}
          firstName={firstName}
          lastName={lastName}
          email={email}
          image={image}
          id={studentId}
        />
      )}
    </Card>
  );
};
