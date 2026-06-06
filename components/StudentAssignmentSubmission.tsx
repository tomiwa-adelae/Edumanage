"use client";
import React, { useRef, useState, useTransition } from "react";
import { Label } from "./ui/label";
import { FileWithMeta } from "./UploadFilesModal";
import {
  IconAward,
  IconCheck,
  IconDownload,
  IconFile,
  IconFileDescription,
  IconPlayerPauseFilled,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { cn, formatDate } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Loader } from "./Loader";
import api from "@/lib/api";
import {
  AssignmentSubmissionAttachment,
  AssignmentSubmissions,
  useAuth,
} from "@/store/useAuth";
import { toast } from "sonner";
import { StudentAssignmentSuccessModal } from "./StudentAssignmentSuccessModal";

interface Props {
  assignmentId: string;
  hasGraded: boolean | undefined;
  hasSubmitted: boolean | undefined;
  submission: AssignmentSubmissions | null | undefined;
  totalMarks: number | undefined;
}

export const StudentAssignmentSubmission = ({
  assignmentId,
  submission,
  hasSubmitted,
  totalMarks,
  hasGraded,
}: Props) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [submittedAttachments, setSubmittedAttachments] = useState<
    AssignmentSubmissionAttachment[]
  >(submission?.attachments ?? []);
  const [pending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [comment, setComment] = useState(submission?.comment ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // 🧠 Helpers
  const getFileType = (file: File): string => {
    const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
    return extension;
  };

  const isImageFile = (file: File): boolean =>
    ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type);

  const createPreview = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  // 🖱️ Drag + Drop
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
    if (droppedFiles.length > 0) handleFilesUpload(droppedFiles);
  };

  // 📂 File input select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(Array.from(e.target.files));
    }
  };

  const handleBrowse = () => fileInputRef.current?.click();

  // 📤 Main upload simulation for multiple files
  const handleFilesUpload = async (selectedFiles: File[]) => {
    const newFiles: FileWithMeta[] = [];

    for (const selectedFile of selectedFiles) {
      const isImg = isImageFile(selectedFile);
      const preview = isImg ? await createPreview(selectedFile) : undefined;

      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file: selectedFile,
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(0) + "KB",
        type: getFileType(selectedFile),
        status: "uploading",
        progress: 0,
        paused: false,
        isImage: isImg,
        preview,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateUpload(f.id));
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id !== fileId) return file;
          if (file.paused) return file;

          if (progress >= 100) {
            clearInterval(interval);
            return { ...file, progress: 100, status: "completed" };
          }
          return { ...file, progress };
        })
      );
    }, 300);
  };

  const togglePause = (id: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id !== id) return file;
        const paused = !file.paused;
        if (!paused && file.progress < 100) simulateUpload(id);
        return { ...file, paused };
      })
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    const completedFiles = files.filter((f) => f.status === "completed");
    if (completedFiles.length === 0) return;

    const submittedFiles = completedFiles.map((d: any) =>
      d.file instanceof File ? d.file : d.file.file
    );

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("comment", comment);
        formData.append("studentId", user?.id!);
        formData.append("schoolId", user?.school?.id!);
        formData.append("assignmentId", assignmentId!);

        // Append all selected files
        if (submittedFiles && submittedFiles.length > 0) {
          for (const file of submittedFiles) {
            formData.append("attachments", file);
          }
        }

        const res = await api.post(
          `/assignment-submissions/${user?.school?.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success(res.data.message);
        setSuccessModal(true); // ✅ open success modal
        setIsDisabled(true);
      } catch (err) {}
    });
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(fileUrl, { mode: "cors" });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        toast.error("Download failed!");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Upload Files</Label>
        {/* Drop Zone */}
        <div className="overflow-y-auto whitespace-nowrap">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-md py-12 text-center transition-colors ${
              isDragging
                ? "border-primary/50 bg-primary/50"
                : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center">
                <IconFile size={32} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Drop your files here, or{" "}
                  <button
                    onClick={handleBrowse}
                    disabled={hasSubmitted}
                    className={cn(
                      "text-primary hover:underline font-medium",
                      hasSubmitted && "hover:no-underline"
                    )}
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
            disabled={hasSubmitted}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.csv,image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          {(hasSubmitted ? submittedAttachments.length : files.length) > 0 && (
            <div className="mt-4 space-y-1.5 overflow-hidden">
              <Label>
                Files to Submit (
                {hasSubmitted ? submittedAttachments.length : files.length})
              </Label>

              <div className="space-y-2">
                {(hasSubmitted ? submittedAttachments : files).map(
                  (file: any, index: number) => {
                    const isServerFile = hasSubmitted;
                    const isImage = isServerFile
                      ? file.fileType?.startsWith("image/")
                      : file.isImage && file.preview;

                    const fileName = isServerFile ? file.fileName : file.name;
                    const fileSize = isServerFile
                      ? `${Math.round(file.fileSize / 1024)} KB`
                      : file.size;
                    const fileType = isServerFile
                      ? file.fileType?.split("/")[1]?.toUpperCase() || "FILE"
                      : file.type;

                    const fileUrl = isServerFile ? file.fileUrl : file.preview;

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted rounded-md"
                      >
                        {/* Thumbnail */}
                        <div className="size-10 rounded-md overflow-hidden flex shrink-0 bg-primary/10 items-center justify-center">
                          {isImage ? (
                            <Image
                              src={fileUrl}
                              alt={fileName}
                              width={1000}
                              height={1000}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <IconFileDescription
                              size={24}
                              className="text-primary"
                            />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="line-clamp-1 max-w-20 text-sm font-medium truncate whitespace-normal flex-1">
                                {fileName}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1">
                              <span className="text-primary font-medium whitespace-normal max-w-[50px] line-clamp-1">
                                {fileType}
                              </span>
                              · {fileSize}
                            </span>
                          </div>

                          {!isServerFile && (
                            <>
                              <Progress
                                value={file.progress}
                                className={cn("h-1")}
                              />
                              {file.progress < 100 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {Math.round(file.progress)}%
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        {/* Action buttons only for unsent files */}
                        {!isServerFile && (
                          <div className="flex items-center gap-2">
                            {file.status === "completed" ? (
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                                <IconCheck
                                  size={16}
                                  className="text-green-600 dark:text-green-200"
                                />
                              </div>
                            ) : (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => togglePause(file.id)}
                                className="hover:bg-gray-200"
                              >
                                {file.paused ? (
                                  <IconPlayerPlay
                                    size={16}
                                    className="text-gray-600"
                                  />
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
                              variant="ghost"
                              onClick={() => removeFile(file.id)}
                              className="hover:bg-red-50"
                            >
                              <IconX size={16} className="text-red-500" />
                            </Button>
                          </div>
                        )}

                        {/* Download button for server attachments */}
                        {isServerFile && (
                          <Button
                            disabled={pending}
                            size="icon"
                            onClick={() =>
                              handleDownload(file.fileUrl, file.fileName)
                            }
                          >
                            {pending ? (
                              <Loader text="" />
                            ) : (
                              <>
                                <IconDownload />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Add comment (Optional)</Label>
        <Textarea
          value={comment}
          readOnly={hasSubmitted}
          disabled={hasSubmitted}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add any notes or comments for your teacher"
        />
      </div>
      {hasGraded ? (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-md text-sm text-emerald-700">
            <p className="font-medium flex items-center gap-2">
              <IconAward className="w-4 h-4" /> Graded on{" "}
              {formatDate(submission?.gradedAt ?? submission?.submittedAt)}
            </p>
            <p className="mt-1">
              Score:{" "}
              <span className="font-medium">
                {submission?.grade ?? "-"} /{" "}
                {totalMarks === 0 ? 100 : totalMarks}
              </span>
            </p>
            {submission?.comment && (
              <p className="mt-1 italic text-muted-foreground">
                “{submission.gradingComment}”
              </p>
            )}
          </div>
          <Button className="w-full" disabled variant={"success"}>
            Graded
          </Button>
        </div>
      ) : hasSubmitted ? (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-md text-sm text-blue-700">
            <p className="font-medium flex items-center gap-2">
              <IconCheck className="w-4 h-4" /> Submitted on{" "}
              {formatDate(submission?.submittedAt)}
            </p>
          </div>
          <Button disabled className="w-full cursor-not-allowed">
            Submitted
          </Button>
        </div>
      ) : (
        <Button
          className="w-full"
          type="button"
          onClick={handleUpload}
          disabled={
            !files.some((f) => f.status === "completed") ||
            pending ||
            isDisabled
          }
        >
          {pending ? <Loader text="Submitting..." /> : "Submit Assignment"}
        </Button>
      )}

      {successModal && (
        <StudentAssignmentSuccessModal onClose={() => setSuccessModal(false)} />
      )}
    </div>
  );
};
