import { EmptyState } from "@/components/EmptyState";
import { NothingFound } from "@/components/NothingFound";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assignment } from "@/store/useAuth";
import { IconBook } from "@tabler/icons-react";
import React from "react";

interface Props {
  assignments: any[] | undefined;
}

export const StaffHandled = ({ assignments }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-1">
          <IconBook className="text-primary size-4" />
          Subjects Handled
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignments?.length === 0 && (
          <NothingFound message="No subjects assigned" />
        )}
        <div className="grid grid-cols-2 gap-2">
          {assignments?.map((a, index) => (
            <div key={index} className="rounded-md border p-3 text-sm">
              {a.Subject.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
