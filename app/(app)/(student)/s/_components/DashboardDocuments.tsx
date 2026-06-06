"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  IconAlertCircle,
  IconCircleX,
  IconClock,
  IconUpload,
} from "@tabler/icons-react";
import { CircleCheckBig } from "lucide-react";
import { UploadFilesModal } from "@/components/UploadFilesModal";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";

const DocumentItem = ({
  title,
  description,
  status,
  required = false,
  remarks,
  type,
  onUploadSuccess,
}: any) => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          icon: CircleCheckBig,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badge: "Approved",
          badgeBg: "bg-green-100",
          badgeText: "text-green-700",
        };
      case "under-review":
        return {
          icon: IconClock,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badge: "Under Review",
          badgeBg: "bg-yellow-100",
          badgeText: "text-yellow-700",
        };
      case "rejected":
        return {
          icon: IconCircleX,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badge: "Rejected",
          badgeBg: "bg-red-100",
          badgeText: "text-red-700",
        };
      case "missing":
      default:
        return {
          icon: IconCircleX,
          iconColor: "text-red-600",
          bgColor: "bg-white dark:bg-muted",
          borderColor: "border-gray-200",
          badge: "Missing",
          badgeBg: "bg-red-100",
          badgeText: "text-red-700",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const handleImport = async (incoming: any) => {
    try {
      const docs = Array.isArray(incoming) ? incoming : [incoming];

      // Extract the actual file objects
      const files = docs.map((d) =>
        d instanceof File
          ? d
          : d.file instanceof File
          ? d.file
          : d.originFileObj instanceof File
          ? d.originFileObj
          : null
      );

      const validFiles = files.filter(Boolean);
      if (validFiles.length === 0) {
        toast.error("No valid files found to upload");
        return;
      }

      // For now, let's only upload the first file (since your endpoint accepts 1 file)
      const file = validFiles[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        `/upload/document/${user?.id}/${type}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // ✅ success
      toast.success(res.data.message);
      setOpenModal(false);
      onUploadSuccess(); // re-fetch doc list
      // if (onUploadSuccess)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <Card className={cn(config.borderColor, "border-2")}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            <div className={cn("p-2 rounded-full", config.bgColor)}>
              <Icon className={cn("size-5", config.iconColor)} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">
                {title}
                <span className="hidden md:inline-block">
                  {required && <Badge variant={"secondary"}>Required</Badge>}
                </span>
                <Badge
                  className={cn(config.badgeBg, config.badgeText, "md:block")}
                >
                  {config.badge}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {description}
                {remarks && status === "rejected" && (
                  <p className="text-xs text-muted-foreground md:hidden mt-1">
                    Remarks: {remarks}
                  </p>
                )}
              </p>
              {status === "missing" && (
                <Button onClick={() => setOpenModal(true)}>
                  <IconUpload />
                  Upload Document
                </Button>
              )}

              {status === "rejected" && (
                <Button
                  variant={"destructive"}
                  onClick={() => setOpenModal(true)}
                >
                  <IconUpload />
                  Re-upload Document
                </Button>
              )}
            </div>
          </div>

          {config.badge && (
            <div className="space-y-0.5 text-right hidden md:block">
              <Badge className={cn(config.badgeBg, config.badgeText)}>
                {config.badge}
              </Badge>
              {remarks && status === "rejected" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Remarks: {remarks}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      {openModal && (
        <UploadFilesModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onImport={handleImport}
        />
      )}
    </Card>
  );
};

interface Props {
  documents: any[];
  onRefresh: any;
}

// Default document list (always shown)
export const defaultDocuments = [
  {
    type: "birth_certificate",
    title: "Birth Certificate",
    description: "A valid birth certificate or sworn declaration of age",
    required: true,
  },
  {
    type: "previous_school_result",
    title: "Previous School Results",
    description: "Last term report card from previous school",
    required: true,
  },
  {
    type: "passport_photo",
    title: "Passport Photograph",
    description: "Recent passport-sized photograph (white background)",
    required: true,
  },
  {
    type: "medical_report",
    title: "Medical Report",
    description: "Recent medical fitness certificate",
    required: true,
  },
  {
    type: "parent_id",
    title: "Parent/Guardian ID",
    description: "Valid identification document of parent or guardian",
    required: true,
  },
  {
    type: "transfer_certificate",
    title: "Transfer Certificate",
    description: "Letter of transfer from previous school (if applicable)",
    required: false,
  },
];

export const DashboardDocuments = ({ documents, onRefresh }: Props) => {
  // Merge backend docs with defaults
  const mergedDocs = defaultDocuments.map((def) => {
    const found = documents.find((doc) => doc.type === def.type);
    return {
      ...def,
      status: found?.status || "missing",
      remarks: found?.remarks || null,
    };
  });

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/10 border-primary/50">
        <IconAlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription>
          <h4 className="font-medium text-primary mb-1">
            Document Upload Guidelines
          </h4>
          <ul className="text-sm text-primary space-y-1 list-disc md:list-inside">
            <li>Accepted formats: PDF, JPG, PNG (Max size: 5MB per file)</li>
            <li>Ensure documents are clear and readable</li>
            <li>All required documents must be uploaded for approval</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {mergedDocs.map((doc, index) => (
          <DocumentItem
            key={index}
            type={doc.type}
            title={doc.title}
            description={doc.description}
            status={doc.status}
            remarks={doc.remarks}
            required={doc.required}
            onUploadSuccess={onRefresh}
          />
        ))}
      </div>
    </div>
  );
};
