"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  IconDownload,
  IconUpload,
  IconFileSpreadsheet,
  IconCheck,
  IconAlertCircle,
  IconX,
} from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UploadStatus {
  status: "idle" | "uploading" | "processing" | "success" | "error";
  message?: string;
  progress?: number;
  errors?: string[];
  successCount?: number;
  totalCount?: number;
}

export const BulkUploadTimetable = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: "idle" });
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setUploadStatus({
        status: "error",
        message: "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.",
      });
      return;
    }

    setFile(selectedFile);
    setUploadStatus({ status: "idle" });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus({ status: "uploading", progress: 0 });

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadStatus((prev) => ({
        ...prev,
        progress: Math.min((prev.progress || 0) + 10, 90),
      }));
    }, 200);

    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append("file", file);
      // const response = await fetch("/api/timetables/bulk-upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);

      // Simulate success response
      setUploadStatus({
        status: "success",
        progress: 100,
        successCount: 5,
        totalCount: 5,
        message: "Timetables uploaded successfully!",
      });

      // Simulate error response
      // setUploadStatus({
      //   status: "error",
      //   message: "Some timetables failed to upload",
      //   errors: [
      //     "Row 5: Invalid teacher ID",
      //     "Row 12: Overlapping time slots for Monday",
      //     "Row 18: Subject not found",
      //   ],
      //   successCount: 2,
      //   totalCount: 5,
      // });
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus({
        status: "error",
        message: "Failed to upload file. Please try again.",
      });
    }
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `Class,Day,Start Time,End Time,Subject Code,Teacher ID,Room,Slot Type
JSS 1A,Monday,08:10,08:50,MTH001,T001,Room 101,REGULAR
JSS 1A,Monday,08:50,09:30,ENG001,T002,Room 102,REGULAR
JSS 1A,Monday,09:30,10:10,PHY001,T003,Lab 1,REGULAR
JSS 1A,Monday,10:10,10:30,,,BREAK,BREAK
JSS 1A,Monday,10:30,11:10,CHE001,T004,Lab 2,REGULAR
JSS 1A,Monday,12:40,13:20,,,LUNCH,LUNCH
JSS 1A,Tuesday,08:10,08:50,MTH001,T001,Room 101,REGULAR`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timetable_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus({ status: "idle" });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <IconFileSpreadsheet className="h-4 w-4" />
        <AlertTitle>How to upload timetables in bulk</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Download the template file below</li>
            <li>Fill in your timetable data following the format</li>
            <li>Upload the completed file (Excel or CSV format)</li>
            <li>Review and confirm the upload</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Download Template */}
      <div className="space-y-2">
        <Label>Step 1: Download Template</Label>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate} className="flex-1">
            <IconDownload className="mr-2 h-4 w-4" />
            Download Excel Template
          </Button>
          <Button variant="outline" onClick={downloadTemplate} className="flex-1">
            <IconDownload className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="space-y-2">
        <Label>Step 2: Upload Your File</Label>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            file && "border-primary bg-primary/5"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInputChange}
          />

          {!file ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <IconUpload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop your file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports Excel (.xlsx, .xls) and CSV files
                </p>
              </div>
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select File
                </label>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <IconFileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={resetUpload}>
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadStatus.status === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadStatus.progress}%</span>
          </div>
          <Progress value={uploadStatus.progress} />
        </div>
      )}

      {/* Success Message */}
      {uploadStatus.status === "success" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <IconCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Upload Successful!</AlertTitle>
          <AlertDescription className="text-green-600">
            {uploadStatus.message}
            {uploadStatus.successCount && uploadStatus.totalCount && (
              <div className="mt-2">
                Successfully imported {uploadStatus.successCount} out of {uploadStatus.totalCount}{" "}
                timetables
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {uploadStatus.status === "error" && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>
            <p>{uploadStatus.message}</p>
            {uploadStatus.errors && uploadStatus.errors.length > 0 && (
              <ScrollArea className="h-32 mt-3 border rounded-md p-2 bg-background/50">
                <div className="space-y-1">
                  {uploadStatus.errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      • {error}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Format Guidelines */}
      <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <IconFileSpreadsheet className="h-4 w-4" />
          File Format Guidelines
        </h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Required Columns:</span>
              <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-0.5">
                <li>Class</li>
                <li>Day</li>
                <li>Start Time</li>
                <li>End Time</li>
                <li>Slot Type</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">Optional Columns:</span>
              <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-0.5">
                <li>Subject Code</li>
                <li>Teacher ID</li>
                <li>Room</li>
              </ul>
            </div>
          </div>
          <div className="pt-2 border-t">
            <span className="font-medium">Slot Types:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {["REGULAR", "BREAK", "LUNCH", "ASSEMBLY", "LITERARY_AND_DEBATE", "LONG"].map(
                (type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {uploadStatus.status === "success" ? (
          <>
            <Button variant="outline" onClick={resetUpload}>
              Upload Another
            </Button>
            <Button onClick={() => window.location.href = "/a/timetables"}>
              View Timetables
            </Button>
          </>
        ) : (
          <Button
            onClick={handleUpload}
            disabled={!file || uploadStatus.status === "uploading"}
          >
            <IconUpload className="mr-2 h-4 w-4" />
            {uploadStatus.status === "uploading" ? "Uploading..." : "Upload File"}
          </Button>
        )}
      </div>
    </div>
  );
};
