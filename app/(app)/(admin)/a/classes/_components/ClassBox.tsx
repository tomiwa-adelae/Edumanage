"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Class, useAuth } from "@/store/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Props {
  schoolClass: Class;
}

export const ClassBox = ({ schoolClass }: Props) => {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-base flex items-center justify-between gap-1">
            {schoolClass.level}
            {schoolClass.section}{" "}
            <div className="flex items-center justify-end gap-1">
              <Badge>Active</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shadow-none"
                    aria-label="Open edit menu"
                  >
                    <IconDotsVertical size={16} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <IconEye />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconEdit />
                    Edit Class
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <IconTrash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </h3>
          <p className="text-sm text-muted-foreground">
            {user?.school?.currentSession}
          </p>
        </div>
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <p className="flex items-center justify-between">
            <span>Class Teacher</span>
            <span className="font-medium text-black">
              {schoolClass.Teacher ? (
                `${
                  schoolClass.Teacher?.user?.title !== null
                    ? schoolClass.Teacher.user?.title
                    : ""
                } ${schoolClass.Teacher.user?.firstName} ${
                  schoolClass.Teacher.user?.lastName
                }`
              ) : (
                <p className="italic">Not assigned</p>
              )}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span>Students</span>
            <span className="font-medium text-black">
              {schoolClass.students.length}/{schoolClass.capacity}
            </span>
          </p>
          <p>
            <small className="mb-1 text-xs flex items-center justify-between">
              <span>Capacity</span>
              <span>
                {(
                  (Number(schoolClass.students.length) /
                    Number(schoolClass.capacity)) *
                  100
                ).toFixed()}
                %
              </span>
            </small>
            <Progress
              value={
                (Number(schoolClass.students.length) /
                  Number(schoolClass.capacity)) *
                100
              }
            />
          </p>
          <Button asChild className="w-full" variant={"outline"}>
            <Link href={`/a/classes/${schoolClass.id}`}>
              <IconEye /> View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
