import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMessage,
  IconPhone,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";

interface Props {
  id: string | undefined;
  username: string | undefined;
}

export const StaffActions = ({ id, username }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"secondary"}>
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/a/staffs/${username || id}`}>
            <IconEye />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/a/staffs/${username || id}/edit`}>
            <IconEdit />
            Edit Staff
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconMessage />
          Send Message
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          <IconTrash />
          Remove Staff
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
