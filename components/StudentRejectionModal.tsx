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
import { UserProfilePicture } from "./UserProfilePicture";
import { useAuth, User } from "@/store/useAuth";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { schoolService } from "@/lib/school";
import { Loader } from "./Loader";

interface Props {
  open: boolean;
  onClose: (updatedStudent?: any) => void;
  student: User;
}

export const StudentRejectionModal = ({ open, onClose, student }: Props) => {
  const { user } = useAuth();
  const [rejectRemark, setRejectRemark] = useState("");
  const [pending, startTransition] = useTransition();

  const handleRejection = () => {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/students/${user?.school?.id}/rejection/${student?.id}`,
          { rejectionReason: rejectRemark }
        );
        toast.success(res.data.message);

        const [updatedStudent] = await Promise.all([
          schoolService.getPendingStudentDetails(
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
          <DialogTitle>Reject student</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this student. The student will
            be able to see this feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <UserProfilePicture
            size="md"
            src={student?.image}
            alt={`${student?.firstName}'s picture`}
          />
          <div className="space-y-1.5">
            <p className="text-base lg:text-lg font-medium">
              {student?.title} {student?.firstName} {student?.lastName}
            </p>
            <p className="text-muted-foreground text-sm">
              {student?.Student.candidateNumber}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reject-reason">Reason for Rejection *</Label>
          <Textarea
            id="reject-reason"
            placeholder="E.g., The information are not valid enough, please apply with better information..."
            value={rejectRemark}
            onChange={(e) => setRejectRemark(e.target.value)}
            rows={4}
            className="resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {rejectRemark.length}/500 characters
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose(student);
              setRejectRemark("");
            }}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRejection}
            disabled={pending || !rejectRemark.trim()}
          >
            {pending ? <Loader text="Rejecting..." /> : "Reject student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
