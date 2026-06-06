import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { IconEdit, IconEye } from "@tabler/icons-react";
import React from "react";

export const SubjectBox = () => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <h3 className="font-medium text-base">
              Advanced Mathematics{" "}
              <Badge variant={"outlinePrimary"}>Core</Badge>{" "}
              <Badge variant={"outlineSuccess"}>Active</Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive mathematics covering calculus, algebra, and
              analytical geometry
            </p>
          </div>
          <div className="grid grid-cols-2 gap-0.5 w-full md:w-auto">
            <Button className="w-full" variant={"outline"}>
              <IconEdit /> Edit
            </Button>
            <Button className="w-full" variant={"outline"}>
              <IconEye /> View Details
            </Button>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-base font-medium">Learning Outcomes:</p>
            <ul className="text-sm text-muted-foreground list-inside list-disc space-y-1">
              <li>Apply differential and integral calculus</li>
              <li>Solve complex algebraic equations</li>
              <p className="cursor-pointer text-primary font-medium hover:underline">
                +2 more
              </p>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium">Assessment Distribution:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center justify-between">
                <span>Continuous:</span> <span className="text-black">30%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Mid-Term:</span> <span className="text-black">30%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Final:</span> <span className="text-black">40%</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-base font-medium">Applicable Classes</p>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
            <Badge variant={"secondary"}>JSS1</Badge>
            <Badge variant={"secondary"}>JSS2</Badge>
            <Badge variant={"secondary"}>JSS3</Badge>
            <Badge variant={"secondary"}>SSS1</Badge>
            <Badge variant={"secondary"}>SSS2</Badge>
            <Badge variant={"secondary"}>SSS3</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
