"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconAlertCircle,
  IconCheck,
  IconDownload,
  IconFileTypeXls,
  IconUpload,
  IconX,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { env } from "@/lib/env";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";

/* ----------------------------- Types ----------------------------- */

interface ClassFormData {
  level: string;
  section: string;
  capacity?: number;
  classRoomNumber?: string;
  description?: string;
  department?: string;
  teacherId?: string;
  teacherEmail?: string; // ✅ add this
}

interface ImportedClass extends ClassFormData {
  status: "valid" | "error";
  errors: string[];
}

/* ----------------------------- Component ----------------------------- */

export function ImportClasses() {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const [importedData, setImportedData] = useState<ImportedClass[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (idx: number) =>
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));

  /* ---------------- Helpers ---------------- */

  const normalizeKey = (key: string) =>
    key.trim().toLowerCase().replace(/\s+/g, "");

  const headerMap: Record<string, keyof ClassFormData> = {
    level: "level",
    section: "section",
    capacity: "capacity",
    classroomnumber: "classRoomNumber",
    "class room number": "classRoomNumber",
    description: "description",
    department: "department",
    teacherid: "teacherId",
    teacheremail: "teacherEmail", // ✅ add this
  };

  /* ---------------- File Parsing ---------------- */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid Excel or CSV file");
      return;
    }

    toast.success("File uploaded successfully — parsing...");

    try {
      let rawRows: any[] = [];

      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
        });
        rawRows = result.data as any[];
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const ws = workbook.Sheets[workbook.SheetNames[0]];
        rawRows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      }

      if (!rawRows.length) {
        toast.error("No rows found in file");
        return;
      }

      // Normalize and map headers
      const normalized: ClassFormData[] = rawRows.map((row) => {
        const mapped: any = {};
        Object.keys(row).forEach((key) => {
          const clean = normalizeKey(key);
          const mappedKey = headerMap[clean] ?? (clean as keyof ClassFormData);
          mapped[mappedKey] = row[key];
        });

        return {
          level: (mapped.level ?? "").toString().trim(),
          section: (mapped.section ?? "").toString().trim(),
          capacity: mapped.capacity ? Number(mapped.capacity) : undefined,
          classRoomNumber: (mapped.classRoomNumber ?? "").toString().trim(),
          description: (mapped.description ?? "").toString().trim(),
          department: (mapped.department ?? "").toString().trim(),
          teacherId: (mapped.teacherId ?? "").toString().trim(),
          teacherEmail: (mapped.teacherEmail ?? "").toString().trim(),
        };
      });

      // Validate
      const validated: ImportedClass[] = normalized.map((item) => {
        const errors: string[] = [];

        if (!item.level) errors.push("Level is required");
        if (!item.section) errors.push("Section is required");
        if (!item.capacity) errors.push("Capacity is required");
        if (item.capacity && item.capacity < 0)
          errors.push("Capacity cannot be negative");

        return { ...item, status: errors.length ? "error" : "valid", errors };
      });

      setImportedData(validated);
      setShowPreview(true);
      toast.success(`Processed ${validated.length} rows successfully`);
    } catch (err) {
      toast.error("Failed to parse file");
    }
  };

  /* ---------------- Download Template ---------------- */

  const downloadTemplate = () => {
    const url = `${env.NEXT_PUBLIC_BACKEND_URL}/templates/class-import-template.xlsx`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "class-import-template.xlsx";
    a.click();
    toast.success("Template downloaded successfully!");
  };

  /* ---------------- Export Errors CSV ---------------- */

  const downloadErrorsCsv = () => {
    const errors = importedData.filter((r) => r.status === "error");
    if (errors.length === 0) {
      toast.error("No error rows to export");
      return;
    }

    const headers = [
      "level",
      "section",
      "capacity",
      "classRoomNumber",
      "description",
      "department",
      "teacherId",
      "teacherEmail",
      "errors",
    ];

    const rows = errors.map((r) =>
      headers
        .map((h) => {
          if (h === "errors") return `"${(r.errors || []).join("; ")}"`;
          const v = (r as any)[h] ?? "";
          return `"${String(v).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csv = `${headers.join(",")}\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `class-import-errors_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${errors.length} error rows`);
  };

  /* ---------------- Import ---------------- */

  const handleImport = () => {
    startTransition(async () => {
      try {
        const validClasses = importedData
          .filter((c) => c.status === "valid" && c.errors.length === 0)
          .map((c) => ({
            level: c.level,
            section: c.section,
            capacity: c.capacity,
            classRoomNumber: c.classRoomNumber,
            description: c.description,
            department: c.department,
            teacherId: c.teacherId,
            teacherEmail: c.teacherEmail,
          }));

        if (validClasses.length === 0) {
          toast.error("No valid class records to import.");
          return;
        }

        const res = await api.post(
          `/classes/${user?.school?.schoolID}/import`,
          { classes: validClasses }
        );

        const createdCount = res.data.results?.length || 0;
        const failedCount = res.data.errors?.length || 0;

        // ✅ Success summary toast
        toast.success(`${createdCount} classes imported successfully.`);

        // ⚠️ Show failed imports if any
        if (failedCount > 0) {
          const errorMessages = res.data.errors
            .map(
              (err: any) =>
                `(${err.level}${err.section ? err.section : ""}) ${err.error}`
            )
            .join("\n");

          // Show summary toast
          toast.warning(`${failedCount} records failed to import.`);

          // Show detailed error(s) in a separate toast
          toast.error(errorMessages, {
            duration: 6000, // optional
          });
        }

        // Optionally redirect or refresh after a delay
        // router.push("/a/classes");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setShowPreview(false);
        setImportedData([]);
      }
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-base">
            Import Classes from Excel/CSV
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload a file containing class information
          </p>
        </div>

        <div className="border p-3 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="flex text-sm text-muted-foreground items-center justify-start gap-1">
            <IconDownload className="size-4" />
            Download our template to ensure correct data format
          </p>
          <Button
            onClick={downloadTemplate}
            className="w-full md:w-auto"
            variant="outline"
          >
            <IconDownload />
            Download Template
          </Button>
        </div>

        {!showPreview && (
          <div className="flex flex-col items-center justify-center gap-2.5 border-dashed border-2 px-6 py-10 rounded-md">
            <IconUpload />
            <p className="font-medium text-md md:text-lg">Upload Class Data</p>
            <p className="text-sm text-muted-foreground">
              Supports Excel (.xlsx, .xls) and CSV files
            </p>
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <IconFileTypeXls />
              Choose File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {showPreview && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-medium text-base">Preview Imported Data</h3>
                <p className="text-sm text-muted-foreground">
                  {importedData.filter((d) => d.status === "valid").length}{" "}
                  valid,{" "}
                  {importedData.filter((d) => d.status === "error").length}{" "}
                  errors
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={downloadErrorsCsv}
                >
                  <IconDownload />
                  Export Errors
                </Button>

                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setShowPreview(false);
                    setImportedData([]);
                  }}
                  variant="outline"
                >
                  <IconX />
                  Clear
                </Button>
              </div>
            </div>

            <Card>
              <CardContent>
                <div className="[&>div]:max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-xs">
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Status</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Teacher's Email</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {importedData.map((c, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              {c.status === "valid" ? (
                                <Badge variant="outlineSuccess">
                                  <IconCheck />
                                  Valid
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <IconAlertCircle />
                                  Error
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{c.level}</TableCell>
                            <TableCell>{c.section}</TableCell>
                            <TableCell>{c.capacity ?? "—"}</TableCell>
                            <TableCell>{c.department ?? "—"}</TableCell>
                            <TableCell>{c.teacherEmail ?? "—"}</TableCell>
                            <TableCell>
                              {c.status === "error" ? (
                                <Button
                                  variant="ghost"
                                  onClick={() => toggleRow(index)}
                                  className="flex items-center gap-2 py-1 px-2"
                                >
                                  {expandedRows[index] ? (
                                    <IconChevronUp />
                                  ) : (
                                    <IconChevronDown />
                                  )}
                                  <span className="text-xs">
                                    {c.errors.length} issue
                                    {c.errors.length > 1 ? "s" : ""}
                                  </span>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>

                          {c.status === "error" && expandedRows[index] && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-red-50">
                                <div className="p-3 rounded">
                                  <strong className="text-sm text-destructive">
                                    Row errors:
                                  </strong>
                                  <ul className="mt-2 ml-4 list-disc text-sm text-destructive">
                                    {c.errors.map((err, i) => (
                                      <li key={i}>{err}</li>
                                    ))}
                                  </ul>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={() => router.push("/a/classes")}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button disabled={pending} onClick={handleImport}>
                {pending ? (
                  <Loader text="Importing..." />
                ) : (
                  `Import ${importedData.length} classes`
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
