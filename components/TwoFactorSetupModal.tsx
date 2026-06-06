"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { env } from "@/lib/env";

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TwoFactorSetupModal({
  isOpen,
  onClose,
  onComplete,
}: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<"qr" | "verify" | "backup">("qr");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Step 1: Generate QR code
  const handleGenerateQR = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/generate`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("qr");
    } catch (err: any) {
      setError(err.message || "Failed to generate QR code");
      toast.error(err.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify and enable 2FA
  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/enable`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret,
            token: verificationCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid verification code");
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes);
      setStep("backup");
      toast.success("Two-factor authentication enabled successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
      toast.error(err.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  // Copy secret to clipboard
  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  // Copy all backup codes
  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied to clipboard");
  };

  // Download backup codes as text file
  const handleDownloadBackupCodes = () => {
    const content = `Two-Factor Authentication Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join(
      "\n"
    )}\n\nKeep these codes in a safe place. Each code can only be used once.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `2fa-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded");
  };

  // Complete setup
  const handleComplete = () => {
    onComplete();
    onClose();
    setStep("qr");
    setQrCode("");
    setSecret("");
    setVerificationCode("");
    setBackupCodes([]);
  };

  // Load QR code on modal open
  useEffect(() => {
    if (isOpen && !qrCode) {
      handleGenerateQR();
    }
  }, [isOpen, qrCode]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {step === "qr" && "Scan the QR code with your authenticator app"}
            {step === "verify" &&
              "Enter the 6-digit code from your authenticator app"}
            {step === "backup" && "Save your backup codes in a secure location"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: QR Code */}
        {step === "qr" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {qrCode && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <Image
                        src={qrCode}
                        alt="QR Code"
                        width={200}
                        height={200}
                        className="w-48 h-48"
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <Label>Or enter this code manually:</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={secret}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleCopySecret}
                        >
                          {copiedSecret ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Alert>
                      <AlertDescription>
                        Use Google Authenticator, Authy, or any TOTP-compatible
                        app to scan this QR code.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep("verify")}
                disabled={loading || !qrCode}
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Verify Code */}
        {step === "verify" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep("qr")}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyAndEnable}
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Enable"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === "backup" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Save these backup codes in a secure location. You can use them
                to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCopyBackupCodes}
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Codes
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadBackupCodes}
                className="flex-1"
              >
                Download
              </Button>
            </div>

            <DialogFooter>
              <Button onClick={handleComplete} className="w-full">
                Complete Setup
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
