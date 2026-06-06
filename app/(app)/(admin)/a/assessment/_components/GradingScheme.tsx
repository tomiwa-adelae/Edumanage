import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconEdit } from "@tabler/icons-react";
import React from "react";

export const GradingScheme = () => {
  const grades = [
    {
      name: "Outstanding",
      grade: "A+",
      range: "90% - 100%",
    },
    {
      name: "Excellent",
      grade: "A",
      range: "80% - 89%",
    },
    {
      name: "Very Good",
      grade: "B+",
      range: "70% - 79%",
    },
    {
      name: "Good",
      grade: "B",
      range: "60% - 69%",
    },
    {
      name: "Satisfactory",
      grade: "C+",
      range: "50% - 59%",
    },
    {
      name: "Acceptable",
      grade: "C",
      range: "40% - 49%",
    },
    {
      name: "Fail",
      grade: "F",
      range: "0% - 39%",
    },
  ];

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <h3 className="font-medium text-base">
              Standard Percentage Grading{" "}
              <Badge variant={"outlineSuccess"}>Active</Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              Percentage based grading system
            </p>
          </div>
          <Button className="w-full md:w-auto" variant={"outline"}>
            <IconEdit />
            Edit
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Grade Ranges:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grades.map(({ name, grade, range }, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-1">
                    <span>{grade}</span>
                    <span className="font-normal text-muted-foreground">
                      {range}
                    </span>
                  </CardTitle>
                  <CardDescription>{name}</CardDescription>
                </CardHeader>
              </Card>
            ))}
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
      </CardContent>
    </Card>
  );
};
