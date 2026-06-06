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
  IconMessage,
  IconPencil,
  IconPhone,
  IconTrash,
  IconUser,
  IconUserQuestion,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  firstName: string;
  username: string;
}

export const QuickActions = ({ firstName, username }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button asChild className="justify-start" variant={"outline"}>
          <Link href={`/t/messages/${username}`}>
            <IconMessage />
            Message {firstName}
          </Link>
        </Button>
        <Button className="justify-start" variant={"outline"}>
          <IconPhone />
          Contact {firstName}'s Parent
        </Button>
        <Button className="justify-start">
          <IconPencil />
          Add Note
        </Button>
      </CardContent>
    </Card>
  );
};
