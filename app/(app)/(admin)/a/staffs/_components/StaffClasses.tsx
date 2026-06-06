import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers } from "@tabler/icons-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { Class } from "@/store/useAuth";
import { NothingFound } from "@/components/NothingFound";
import Link from "next/link";

interface Props {
  classes: Class[] | undefined;
}

export const StaffClasses = ({ classes }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-1">
          <IconUsers className="text-primary size-4" />
          Assigned Classes {classes?.length !== 0 && `(${classes?.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes?.length === 0 && <NothingFound message="No class assigned" />}
        {classes?.map((c, index) => (
          <Link
            href={`/a/classes/${c.id}`}
            key={index}
            className="space-y-1.5 block group border hover:border-primary rounded-md px-3 py-4"
          >
            <p className="flex items-center group-hover:text-primary transition-all justify-between gap-2 text-base font-medium">
              <span>
                {c.level}
                {c.section}
              </span>
              <Badge
                className="group-hover:text-primary group-hover:border-primary transition-all"
                variant={"outline"}
              >
                {c.students.length} students
              </Badge>
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
