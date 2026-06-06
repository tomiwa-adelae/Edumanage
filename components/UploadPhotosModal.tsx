"use client";
import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  IconCheck,
  IconPhoto,
  IconPlayerPauseFilled,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

export interface FileWithMeta {
  id: string;
  file: File;
  name: string;
  size: string;
  status: "uploading" | "completed" | "paused";
  progress: number;
  paused: boolean;
  preview: string;
}

interface UploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onImport?: (files: FileWithMeta[]) => void;
}

export const UploadPhotosModal = ({
  isOpen = true,
  onClose,
  onImport,
}: UploadModalProps) => {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, NodeJS.Timeout>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)
    );

    const filesWithMeta: FileWithMeta[] = await Promise.all(
      validFiles.map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(0) + "KB",
        status: "uploading" as const,
        progress: 0,
        paused: false,
        preview: await createPreview(file),
      }))
    );

    setFiles((prev) => [...prev, ...filesWithMeta]);

    // Simulate upload progress
    filesWithMeta.forEach((fileMeta) => {
      simulateUpload(fileMeta.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: "completed" as const, progress: 100 }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileId && !f.paused) {
              return { ...f, progress: Math.min(progress, 100) };
            }
            return f;
          })
        );
      }
    }, 300);

    setUploadProgress((prev) => ({ ...prev, [fileId]: interval }));
  };

  const togglePause = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          if (f.paused) {
            simulateUpload(fileId);
          } else {
            clearInterval(uploadProgress[fileId]);
          }
          return { ...f, paused: !f.paused };
        }
        return f;
      })
    );
  };

  const removeFile = (fileId: string) => {
    clearInterval(uploadProgress[fileId]);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleUrlUpload = () => {
    if (urlInput.trim()) {
      // Handle URL upload logic here
      setUrlInput("");
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleImport = () => {
    if (onImport) {
      onImport(files);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5 space-y-4">
        <AlertDialogHeader className="flex flex-row items-center justify-between gap-1">
          <AlertDialogTitle>Upload Photos</AlertDialogTitle>
          <Button size="icon" variant={"ghost"}>
            <IconX />
          </Button>
        </AlertDialogHeader>
        <div className="overflow-y-auto whitespace-nowrap p-1">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-md p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                <IconPhoto size={32} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Drop your image here, or{" "}
                  <button
                    onClick={handleBrowse}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: PNG, JPG, JPEG, WEBP
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                >
                  {/* Image Preview */}
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {file.size}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      {/* <div
                        className={`h-1.5 rounded-full transition-all ${
                          file.status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      /> */}
                      <Progress value={file.progress} className={cn("h-1")} />
                    </div>
                    {file.progress < 100 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(file.progress)}%
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === "completed" ? (
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <IconCheck size={16} className="text-green-600" />
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant={"ghost"}
                        onClick={() => togglePause(file.id)}
                        className="hover:bg-gray-200"
                      >
                        {file.paused ? (
                          <IconPlayerPlay size={16} className="text-gray-600" />
                        ) : (
                          <IconPlayerPauseFilled
                            size={16}
                            className="text-gray-600"
                          />
                        )}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant={"ghost"}
                      onClick={() => removeFile(file.id)}
                      className="hover:bg-red-50"
                    >
                      <IconX size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <AlertDialogFooter className="border-t pt-4 sm:items-center">
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button type="button">Upload</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
