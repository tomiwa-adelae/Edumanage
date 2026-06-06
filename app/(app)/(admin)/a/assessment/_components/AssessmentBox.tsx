import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IconEdit, IconEye } from "@tabler/icons-react";
import React from "react";

export const AssessmentBox = () => {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-base flex items-center justify-between gap-1">
            <span>Continuous Assessment</span>
            <Badge variant={"outlineSuccess"}>Active</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Regular classroom assessments including quizzes, assignments, and
            participation
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-1 ">
            <p className="text-muted-foreground flex-2">Weight:</p>
            <div className="gap-1 flex-1 flex items-center justify-end">
              <Progress value={30} /> <span className="font-medium">30%</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <p className="text-muted-foreground flex-2">Frequency:</p>
            <span className="font-medium">Monthly</span>
          </div>
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
        <div>
          <p className="font-medium text-sm">Subjects:</p>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
            <Badge variant={"secondary"}>Mathematics</Badge>
            <Badge variant={"secondary"}>Science</Badge>
            <Badge variant={"secondary"}>English</Badge>
            <Badge variant={"secondary"}>Social Students</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="w-full" variant={"outline"}>
            <IconEdit />
            Edit
          </Button>
          <Button className="w-full" variant={"outline"}>
            <IconEye />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
