import React from "react";
import { SubjectSearchComponent } from "../../_components/SubjectSearchComponent";
import { Subject } from "../page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { NothingFound } from "@/components/NothingFound";

interface Props {
  subjects: Subject[];
}

export const SubjectCatalog = ({ subjects }: Props) => {
  return (
    <div className="space-y-4">
      <SubjectSearchComponent />
      {subjects.length === 0 && <NothingFound message="No subjects found" />}
      {subjects.map((subject, index) => (
        <Card key={index}>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <h3 className="font-medium text-base lg:text-lg">
                  {subject.name}{" "}
                  {subject.isCore && (
                    <Badge variant={"outlinePrimary"}>Core</Badge>
                  )}{" "}
                  <Badge variant={"outlineSuccess"}>Active</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subject.description}
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
                <p className="text-sm font-medium lg:text-base">Details:</p>
                <ul className="text-sm text-muted-foreground list-inside list-disc space-y-1">
                  <li>Department of {subject.department.toUpperCase()}</li>
                  <li>{subject.hoursPerWeek} hours/week</li>
                  <li>Pass score is {subject.passScore}</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium lg:text-base">
                  Assessment Distribution:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center justify-between">
                    <span>Continuous:</span>{" "}
                    <span className="text-black">30%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Mid-Term:</span>{" "}
                    <span className="text-black">30%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Final:</span> <span className="text-black">40%</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium lg:text-base">
                Applicable Classes
              </p>
              <div className="flex gap-2 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
                {subject.classes.map((c, i) => (
                  <Badge key={i} variant={"secondary"}>
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
