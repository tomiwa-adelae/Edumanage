import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatDate } from "@/lib/utils";
import { IconCreditCard, IconDotsVertical } from "@tabler/icons-react";
import { Dot } from "lucide-react";

export const FeeRow = () => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserProfilePicture />
          <div>
            <div className="font-medium">Tomiwa Adelae Ademola </div>
            <span className="text-muted-foreground mt-0.5 text-xs">
              STU20244001{" "}
              <Dot className="size-3 text-muted-foreground inline-block" /> JSS1
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>Tuition Fee</TableCell>
      <TableCell>
        <NairaIcon />
        15,000
      </TableCell>
      <TableCell>{formatDate(new Date())}</TableCell>
      <TableCell>
        <Badge variant={"outlineSuccess"}>Paid</Badge>
      </TableCell>
      <TableCell>
        <IconCreditCard className="inline-block text-muted-foreground size-5 mr-1" />
        Online
      </TableCell>
      <TableCell className="text-right">
        <Button size="icon" variant={"secondary"}>
          <IconDotsVertical />
        </Button>
      </TableCell>
    </TableRow>
  );
};
