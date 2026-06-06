import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StaffRow } from "./StaffRow";
import { StaffCard } from "./StaffCard";
import { User } from "@/store/useAuth";
import { NothingFound } from "@/components/NothingFound";

interface Props {
  staffs: User[];
}

export const StaffsLists = ({ staffs }: Props) => {
  return (
    <Card className="gap-0">
      <CardHeader>
        <h3 className="font-medium text-base">
          Staff members {staffs?.length !== 0 && `(${staffs?.length})`}
        </h3>
      </CardHeader>
      <CardContent className="pt-4">
        {staffs?.length === 0 && <NothingFound message="No staff found yet!" />}
        {staffs?.length !== 0 && (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffs?.map((staff) => (
                    <StaffRow key={staff?.id} staff={staff} />
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden space-y-4">
              {staffs?.map((staff) => (
                <StaffCard key={staff?.id} staff={staff} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
