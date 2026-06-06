"use client";
import React, { useTransition } from "react";
import { Card, CardContent } from "./ui/card";
import {
  IconDownload,
  IconEye,
  IconFileDescription,
  IconFileText,
} from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Attachment } from "@/store/useAuth";
import { formatFileSize } from "@/lib/utils";
import { env } from "@/lib/env";
import { toast } from "sonner";
import { Loader } from "./Loader";

interface Props {
  attachment: Attachment;
}

export const AssignmentAttachment = ({ attachment }: Props) => {
  const [pending, startTransition] = useTransition();
  const handleDownload = async () => {
    startTransition(async () => {
      try {
        const response = await fetch(attachment.fileUrl, { mode: "cors" });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.fileName;
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
    <Card>
      <CardContent className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-start gap-2">
          <div className={`p-3 rounded-md bg-green-500/10`}>
            <IconFileText className="size-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium break-all line-clamp-1">
              {attachment.fileName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(attachment.fileSize)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button size="icon" variant={"outline"} asChild>
            <a
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconEye />
            </a>
          </Button>

          <Button disabled={pending} size="icon" onClick={handleDownload}>
            {pending ? (
              <Loader text="" />
            ) : (
              <>
                <IconDownload />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
