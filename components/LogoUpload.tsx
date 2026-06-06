"use client";

import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onUpload?: (image: string) => void;
  currentLogo?: string | null;
}

export const LogoUpload = ({
  isOpen = true,
  onClose,
  onUpload,
  currentLogo,
}: Props) => {
  const [logo, setLogo] = useState<string | null>(currentLogo || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  // Handle file browse
  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Handle file read
  const handleFile = (file: File) => {
    if (
      !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type
      )
    ) {
      alert("Only PNG, JPG, JPEG, or WEBP files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setLogo(null);
  };

  const handleSave = () => {
    if (logo && onUpload) onUpload(logo);
    if (onClose) onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col gap-0 sm:max-w-md">
        <AlertDialogHeader className="flex flex-row items-center justify-between pb-4">
          <AlertDialogTitle>Upload School Logo</AlertDialogTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <IconX />
          </Button>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          {!logo ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-md p-12 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 bg-gray-50"
              }`}
              onClick={handleBrowse}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconPhoto size={32} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Drop your logo here, or{" "}
                  <span className="text-primary font-medium hover:underline">
                    browse
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: PNG, JPG, JPEG, WEBP
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full aspect-square bg-gray-50 border rounded-md flex items-center justify-center overflow-hidden ">
                <Image
                  width={1000}
                  height={1000}
                  src={logo}
                  alt="School Logo"
                  className="aspect-video size-full"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleRemove}
                >
                  <IconX size={16} className="mr-2" /> Remove
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBrowse}
                >
                  <IconUpload size={16} className="mr-2" /> Replace
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <AlertDialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!logo}>
            Save Logo
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
