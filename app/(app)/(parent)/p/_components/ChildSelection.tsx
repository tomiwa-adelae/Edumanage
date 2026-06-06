"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { ParentChildrenLink, Student } from "@/store/useAuth";
import React, { useState } from "react";

interface Props {
  children: ParentChildrenLink[];
  onChange: (value: { childId: string }) => void;
}

export const ChildSelection = ({ children, onChange }: Props) => {
  const defaultChildId =
    children.length > 0 ? children[0]?.student?.user?.id : "";
  const [selectedChild, setSelectedChild] = useState(defaultChildId);

  const handleChange = (childId: string) => {
    onChange({ childId });
  };

  return (
    <div className="space-y-1.5">
      <Label>Select Child</Label>
      <Select
        value={selectedChild}
        onValueChange={(value) => {
          setSelectedChild(value);
          handleChange(value);
        }}
      >
        <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
          <SelectValue placeholder="Select child" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child, index) => (
            <SelectItem value={child?.student?.user?.id!} key={child?.id}>
              <span className="flex items-center text-left gap-2">
                <UserProfilePicture
                  src={child?.student?.user?.image!}
                  alt={`${child?.student?.user?.firstName}'s picture`}
                  size="sm"
                />
                <span className="text-left">
                  <span className="block font-medium">
                    {child?.student?.user?.firstName}{" "}
                    {child?.student?.user?.lastName}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {child?.student?.user?.email}
                  </span>
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
