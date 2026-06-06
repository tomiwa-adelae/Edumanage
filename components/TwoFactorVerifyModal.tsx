"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/lib/env";

interface TwoFactorVerifyModalProps {
  isOpen: boolean;
  userId: string;
  tempToken: string;
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

export function TwoFactorVerifyModal({
  isOpen,
  userId,
  tempToken,
  onSuccess,
  onCancel,
}: TwoFactorVerifyModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter a verification code");
      return;
    }

    if (!useBackupCode && verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/login/2fa/verify`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
          body: JSON.stringify({
            userId,
            token: verificationCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Invalid verification code. Please try again."
        );
      }

      const data = await response.json();
      toast.success(data.message || "Login successful!");
      onSuccess(data.user);

      // Reset form
      setVerificationCode("");
      setUseBackupCode(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
      toast.error(err.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVerificationCode("");
    setUseBackupCode(false);
    setError("");
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {useBackupCode
              ? "Enter one of your backup codes"
              : "Enter the 6-digit code from your authenticator app"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="verificationCode">
              {useBackupCode ? "Backup Code" : "Verification Code"}
            </Label>
            <Input
              id="verificationCode"
              placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "");
                if (!useBackupCode) {
                  setVerificationCode(value.replace(/\D/g, ""));
                } else {
                  setVerificationCode(value.toUpperCase());
                }
              }}
              maxLength={useBackupCode ? undefined : 6}
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
              disabled={loading}
            />
          </div>

          <Button
            variant="link"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setVerificationCode("");
              setError("");
            }}
            className="p-0 h-auto text-sm"
            disabled={loading}
          >
            {useBackupCode
              ? "Use authenticator code instead"
              : "Use backup code instead"}
          </Button>

          <Alert>
            <AlertDescription>
              {useBackupCode
                ? "Backup codes can only be used once. Make sure to keep your remaining codes safe."
                : "Open your authenticator app to get your verification code."}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={
              loading ||
              !verificationCode ||
              (!useBackupCode && verificationCode.length !== 6)
            }
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Login"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
