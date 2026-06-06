"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader } from "./Loader";
import { UserProfilePicture } from "./UserProfilePicture";
import { useAuth } from "@/store/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";

interface Props {
  open: boolean;
  onClose: (updatedUser?: any) => void;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role: string;
  image?: string | null;
}

export const ResetPasswordModal = ({
  open,
  onClose,
  firstName,
  lastName,
  email,
  image,
  id,
  role,
}: Props) => {
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/schools/${user?.school?.id}/reset-password/${id}`
        );
        toast.success(
          res.data.message || "Password has been reset successfully"
        );
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to reset password"
        );
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to reset the password for this user. Please confirm
            this action.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* User Info */}
        <div className="my-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-md">
            <UserProfilePicture
              size="sm"
              src={image}
              alt={`${firstName}'s picture`}
            />
            <div>
              <p className="font-medium text-sm">
                {firstName} {lastName}
                <Badge
                  variant={
                    role === "ADMINISTRATOR"
                      ? "admin"
                      : role === "STUDENT"
                      ? "student"
                      : role === "PARENT"
                      ? "parent"
                      : role === "TEACHER"
                      ? "teacher"
                      : role === "EXAM_OFFICER"
                      ? "exam_officer"
                      : role === "LIBRARIAN"
                      ? "librarian"
                      : role === "BURSAR"
                      ? "bursar"
                      : role === "DATA_ANALYST"
                      ? "data_analyst"
                      : role === "IT_SUPPORT"
                      ? "it_support"
                      : role === "PRINCIPAL"
                      ? "principal"
                      : "outlinePurple"
                  }
                >
                  {role}
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100 text-xs rounded-md p-3">
          ⚠️ Resetting this user’s password will generate a new one
          automatically. The user will be required to log in again using the new
          credentials.
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button onClick={handleReset} disabled={pending}>
            {pending ? <Loader text="Resetting..." /> : "Confirm Reset"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
