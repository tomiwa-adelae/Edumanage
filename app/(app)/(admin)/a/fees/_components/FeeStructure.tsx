import { NairaIcon } from "@/components/NairaIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { IconEdit, IconEye } from "@tabler/icons-react";
import React from "react";

export const FeeStructure = () => {
  return (
    <Card>
      <CardContent className="space-y-6">
        <CardTitle className="flex items-center justify-between gap-1">
          <span>Tuition Fee</span>
          <span>
            <Badge variant={"outlineSuccess"}>Active</Badge>
          </span>
        </CardTitle>
        <h3 className="font-medium text-2xl">
          <NairaIcon />
          17,000
        </h3>
        <div className="text-sm space-y-2">
          <p className="flex items-center justify-between gap-1">
            <span>Frequency:</span>
            <span>Quarterly</span>
          </p>
          <p className="flex items-center justify-between gap-1">
            <span>Due Date:</span>
            <span>{formatDate(new Date())}</span>
          </p>
        </div>
        <div>
          <p className="font-medium text-sm">Applicable Classes</p>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
            <Badge variant={"secondary"}>JSS1</Badge>
            <Badge variant={"secondary"}>JSS2</Badge>
            <Badge variant={"secondary"}>JSS3</Badge>
            <Badge variant={"secondary"}>SSS2</Badge>
            <Badge variant={"secondary"}>SSS2</Badge>
            <Badge variant={"secondary"}>SSS2</Badge>
            <Badge variant={"secondary"}>SSS2</Badge>
            <Badge variant={"secondary"}>SSS2</Badge>
            <Badge variant={"secondary"}>SSS1</Badge>
            <Badge variant={"secondary"}>SSS3</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={"outline"}>
            <IconEdit />
            Edit
          </Button>
          <Button variant={"outline"}>
            <IconEye />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
