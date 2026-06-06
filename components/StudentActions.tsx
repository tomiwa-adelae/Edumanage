"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMessage,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { DeleteUserModal } from "./DeleteUserModal";

interface Props {
  firstName: string;
  lastName: string;
  username: string;
  studentId: string;
  image: string | null;
  email: string;
  role: string;
}

export const StudentActions = ({
  firstName,
  username,
  lastName,
  studentId,
  image,
  email,
  role,
}: Props) => {
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"secondary"}>
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/a/students/${username}`}>
            <IconEye />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/a/students/${username}/edit`}>
            <IconEdit />
            Edit Student
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconMessage />
          Send Message
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setOpenDeleteUserModal(true)}
          className="text-destructive"
        >
          <IconTrash />
          Delete Student
        </DropdownMenuItem>
      </DropdownMenuContent>
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
    </DropdownMenu>
  );
};
