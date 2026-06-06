"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Class, useAuth, User } from "@/store/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { schoolService } from "@/lib/school";
import { UserProfilePicture } from "./UserProfilePicture";
import { Label } from "./ui/label";
import { RequiredAsterisk } from "./RequiredAsterisk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Loader } from "./Loader";

interface Props {
  open: boolean;
  onClose: (updatedStudent?: any) => void;
  student: User;
  classes: Class[];
}
export const StudentApprovalModal = ({
  open,
  onClose,
  student,
  classes,
}: Props) => {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState("");

  const [pending, startTransition] = useTransition();

  const handleApproval = () => {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/students/${user?.school?.id}/approval/${student?.id}`,
          { classId: selectedClassId }
        );
        toast.success(res.data.message);

        const [updatedStudent] = await Promise.all([
          schoolService.getStudentDetails(
            user?.school?.id!,
            student?.username!
          ),
        ]);

        onClose(updatedStudent);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Approve Student</DialogTitle>
          <DialogDescription>
            Assign a class to {student?.firstName} {student?.lastName} to
            complete the approval process.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-md">
            <UserProfilePicture
              size="sm"
              src={student?.image}
              alt={`${student?.firstName}'s picture`}
            />
            <div>
              <p className="font-medium text-sm">
                {student?.title} {student?.firstName} {student?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {student?.Student.candidateNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="class-select">
            Assign Class <RequiredAsterisk />
          </Label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.length > 0 ? (
                classes.map((c) => (
                  <SelectItem value={c.id} key={c.id}>
                    {c.level}
                    {c.section} {c.department ? `(${c.department})` : ""}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No classes available
                </div>
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The student applied for: {student?.Student.desiredClass}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setSelectedClassId("");
            }}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApproval}
            disabled={pending || !selectedClassId}
            className="bg-green-600 hover:bg-green-700"
          >
            {pending ? <Loader text="Approving..." /> : "Approve Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
