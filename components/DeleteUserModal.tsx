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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader } from "./Loader";
import { UserProfilePicture } from "./UserProfilePicture";
import { useAuth } from "@/store/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string | null;
}

export const DeleteUserModal = ({
  open,
  onClose,
  firstName,
  lastName,
  email,
  role,
  id,
  image,
}: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmationText, setConfirmationText] = useState("");

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await api.delete(`/schools/${user?.school?.id}/${id}`);
        toast.success(
          `${firstName} ${lastName}'s account has been permanently deleted.`
        );
        onClose();
        router.back();
        setConfirmationText("");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    });
  };

  const isConfirmed = confirmationText.trim().toUpperCase() === "DELETE";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete User Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm that you want to
            permanently delete this user’s account.
          </DialogDescription>
        </DialogHeader>

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
                <span className="ml-2 px-2 py-0.5 text-xs rounded-md bg-blue-100 text-blue-700 font-semibold">
                  {role}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100 text-xs rounded-md p-3">
          ⚠️ Once deleted, this user’s account and all related data will be
          permanently removed.
          <br />
          Please type <strong>DELETE</strong> below to confirm.
        </div>

        {/* Confirmation Input */}
        <div className="mt-4">
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="text-sm"
            disabled={pending}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setConfirmationText("");
            }}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmed || pending}
            className="bg-red-600 hover:bg-red-700"
          >
            {pending ? <Loader text="Deleting..." /> : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
