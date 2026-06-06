"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { toast } from "sonner";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { env } from "@/lib/env";
import { useAuth } from "@/store/useAuth";

export default function InviteStaff() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const { user } = useAuth();

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      //   toast.success("Copied");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const inviteLink = `${env.NEXT_PUBLIC_FRONTEND_URL}/onboarding/staff?id=${user?.school?.schoolID}`;

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-base">Send Staff Invitation</h3>
            <p className="text-sm text-muted-foreground">
              Invite staff to onboard themselves and complete their profile
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2.5 border-dashed border-2 px-6 py-10 rounded-md">
            <div className="relative w-full">
              <Input
                ref={inputRef}
                className="pe-9"
                type="text"
                defaultValue={inviteLink}
                readOnly
              />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopy}
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed"
                      aria-label={copied ? "Copied" : "Copy to clipboard"}
                      disabled={copied}
                    >
                      <div
                        className={cn(
                          "transition-all",
                          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        )}
                      >
                        <IconCheck
                          className="stroke-emerald-500"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className={cn(
                          "absolute transition-all",
                          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                        )}
                      >
                        <IconCopy size={16} aria-hidden="true" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Copy to clipboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
