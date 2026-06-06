"use client";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMessage,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  firstName: string;
  lastName: string;
  username: string;
  studentId: string;
  image: string | null;
  email: string;
  role: string;
}

export const StudentActions = ({ username }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"secondary"}>
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/t/students/${username}`}>
            <IconEye />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/t/students/${username}/edit`}>
            <IconEdit />
            Edit Student
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconMessage />
          Send Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
