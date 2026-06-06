"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { TwoFactorSetupModal } from "./TwoFactorSetupModal";
import { env } from "@/lib/env";

interface TwoFactorSettingsProps {
  userId: string;
  schoolId?: string;
  isSchoolAdmin?: boolean;
}

interface TwoFactorStatus {
  enabled: boolean;
  required: boolean;
  schoolEnforced: boolean;
  schoolName?: string;
}

export function TwoFactorSettings({
  userId,
  schoolId,
  isSchoolAdmin = false,
}: TwoFactorSettingsProps) {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [backupCodesModalOpen, setBackupCodesModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [processingDisable, setProcessingDisable] = useState(false);
  const [processingBackupCodes, setProcessingBackupCodes] = useState(false);
  const [schoolEnforcement, setSchoolEnforcement] = useState(false);
  const [processingEnforcement, setProcessingEnforcement] = useState(false);

  // Fetch 2FA status
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/status`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setSchoolEnforcement(data.schoolEnforced || false);
      }
    } catch (error) {
      console.error("Failed to fetch 2FA status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Disable 2FA
  const handleDisable2FA = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setProcessingDisable(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/disable`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to disable 2FA");
      }

      toast.success("Two-factor authentication disabled");
      setDisableModalOpen(false);
      setPassword("");
      fetchStatus();
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA");
    } finally {
      setProcessingDisable(false);
    }
  };

  // Generate new backup codes
  const handleGenerateBackupCodes = async () => {
    setProcessingBackupCodes(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/backup-codes`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate backup codes");
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes);
      setBackupCodesModalOpen(true);
      toast.success("New backup codes generated");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate backup codes");
    } finally {
      setProcessingBackupCodes(false);
    }
  };

  // Download backup codes
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

  // School-wide enforcement (admin only)
  const handleSchoolEnforcement = async (enforce: boolean) => {
    if (!schoolId) return;

    setProcessingEnforcement(true);
    try {
      const url = `${env.NEXT_PUBLIC_BACKEND_URL}/schools/${schoolId}/2fa/enforce`;
      const response = await fetch(url, {
        method: enforce ? "POST" : "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${enforce ? "enforce" : "remove"} 2FA requirement`
        );
      }

      toast.success(
        enforce
          ? "Two-factor authentication is now required for all users"
          : "Two-factor authentication requirement removed"
      );
      setSchoolEnforcement(enforce);
      fetchStatus();
    } catch (error: any) {
      toast.error(error.message || "Failed to update 2FA enforcement");
      setSchoolEnforcement(!enforce);
    } finally {
      setProcessingEnforcement(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            {status?.enabled && (
              <Badge variant="default" className="bg-green-500">
                <ShieldCheck className="md:mr-1 size-3" />
                <span className="hidden md:inline-block">Enabled</span>
              </Badge>
            )}
          </div>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User 2FA Status */}
          <div className="space-y-4">
            {status?.required && !status?.enabled && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your school requires two-factor authentication. Please enable
                  it to continue using your account.
                </AlertDescription>
              </Alert>
            )}

            {status?.schoolEnforced && (
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication is enforced by your school
                  administrator.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Your Status</h3>
              {status?.enabled ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          2FA is currently enabled
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your account is protected with two-factor
                          authentication
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-start gap-2">
                    <Button
                      variant="outline"
                      onClick={handleGenerateBackupCodes}
                      disabled={processingBackupCodes}
                      className="flex-1"
                    >
                      {processingBackupCodes ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-4 w-4" />
                      )}
                      Generate Backup Codes
                    </Button>
                    {!status?.schoolEnforced && (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setDisableModalOpen(true)}
                      >
                        Disable 2FA
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">2FA is disabled</p>
                        <p className="text-xs text-muted-foreground">
                          Enable 2FA to better protect your account
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setSetupModalOpen(true)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* School Admin Settings */}
          {/* {isSchoolAdmin && schoolId && (
            <>
              <Separator />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">
                    School-Wide Enforcement
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Require all users in your school to enable two-factor
                    authentication
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="h-5 w-5" />
                    <div>
                      <Label
                        htmlFor="enforce-2fa"
                        className="text-sm font-medium"
                      >
                        Require 2FA for all users
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {schoolEnforcement
                          ? "All users must enable 2FA to access their accounts"
                          : "Users can optionally enable 2FA"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="enforce-2fa"
                    checked={schoolEnforcement}
                    onCheckedChange={handleSchoolEnforcement}
                    disabled={processingEnforcement}
                  />
                </div>

                {schoolEnforcement && (
                  <Alert>
                    <AlertDescription>
                      Users without 2FA enabled will be prompted to set it up on
                      their next login.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )} */}
        </CardContent>
      </Card>

      {/* Setup Modal */}
      <TwoFactorSetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onComplete={() => {
          fetchStatus();
        }}
      />

      {/* Disable 2FA Modal */}
      <Dialog open={disableModalOpen} onOpenChange={setDisableModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your password to disable 2FA. This will make your account
              less secure.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Warning: Disabling 2FA will reduce your account security.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDisableModalOpen(false);
                setPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={processingDisable || !password}
            >
              {processingDisable ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable 2FA"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Modal */}
      <Dialog
        open={backupCodesModalOpen}
        onOpenChange={setBackupCodesModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Backup Codes</DialogTitle>
            <DialogDescription>
              Save these codes in a secure location. Each code can only be used
              once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                These codes replace your previous backup codes. Download or copy
                them now.
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

            <Button
              variant="outline"
              onClick={handleDownloadBackupCodes}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Backup Codes
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setBackupCodesModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
