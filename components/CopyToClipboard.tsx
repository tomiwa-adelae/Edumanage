"use client";
import { Copy } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const CopyToClipboard = ({ text }: { text: string }) => {
  const copyTextToClipboard = async ({ text }: { text: any }) => {
    try {
      await navigator.clipboard.writeText(text);
      return toast.success(`Copied!`);
    } catch (err) {
      return toast.error("Failed to copy!");
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Copy
          onClick={() =>
            copyTextToClipboard({
              text,
            })
          }
          className="size-4 ml-2 inline-block cursor-pointer"
        />
      </TooltipTrigger>
      <TooltipContent className="dark:text-white">
        <p>Click to copy</p>
      </TooltipContent>
    </Tooltip>
  );
};
