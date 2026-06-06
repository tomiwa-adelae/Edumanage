import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconEdit, IconEye } from "@tabler/icons-react";
import React from "react";

export const ClassStructure = () => {
  return (
    <Card className="gap-0">
      <CardHeader>
        <h3 className="font-medium text-base">JSS1</h3>
        <p className="text-sm text-muted-foreground">
          Junior Secondary School 1
        </p>
      </CardHeader>
      <CardContent className="space-y-6 mt-6">
        <div>
          <p className="font-medium text-sm md:text-base">Sections:</p>
          <div className="grid gap-2 text-sm">
            <div className="rounded-md bg-muted p-3 flex items-center justify-between">
              <span>Section A</span>
              <span className="text-muted-foreground text-sm">
                38/40 students
              </span>
            </div>
            <div className="rounded-md bg-muted p-3 flex items-center justify-between">
              <span>Section B</span>
              <span className="text-muted-foreground text-sm">
                38/40 students
              </span>
            </div>
            <div className="rounded-md bg-muted p-3 flex items-center justify-between">
              <span>Section C</span>
              <span className="text-muted-foreground text-sm">
                38/40 students
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="font-medium text-sm md:text-base">Core Subjects:</p>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
            <Badge variant={"secondary"}>Mathematics</Badge>
            <Badge variant={"secondary"}>Science</Badge>
            <Badge variant={"secondary"}>English</Badge>
            <Badge variant={"secondary"}>Social Studies</Badge>
            <Badge variant={"secondary"}>Hindi</Badge>
            <Badge variant={"secondary"}>French</Badge>
            <Badge variant={"secondary"}>Yoruba</Badge>
            <Badge variant={"secondary"}>Economics</Badge>
          </div>
        </div>
        <div>
          <p className="font-medium text-sm md:text-base">Class Coordinator:</p>
          <p className="mt-1 text-base text-muted-foreground">
            Ms. Sarah Johnson
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant={"outline"}>
            <IconEdit /> Edit
          </Button>
          <Button variant={"outline"}>
            <IconEye /> View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
