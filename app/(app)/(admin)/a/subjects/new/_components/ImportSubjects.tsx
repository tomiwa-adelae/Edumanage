"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconFileTypeXls,
  IconUpload,
  IconX,
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
import api from "@/lib/api";
import { env } from "@/lib/env";
import { useAuth } from "@/store/useAuth";

/* ----------------------------- Types ----------------------------- */

interface SubjectFormData {
  name: string;
  department?: string;
  description?: string;
  hoursPerWeek?: number;
  passScore?: number;
  classes?: string; // comma-separated (e.g., "SS1,SS2")
  isCore?: boolean | string;
}

interface ImportedSubject extends SubjectFormData {
  status: "valid" | "error";
  errors: string[];
}

/* ----------------------------- Component ----------------------------- */

export function ImportSubjects() {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const [importedData, setImportedData] = useState<ImportedSubject[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (idx: number) =>
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));

  /* ---------------- Helpers ---------------- */

  const normalizeKey = (key: string) =>
    key.trim().toLowerCase().replace(/\s+/g, "");

  const headerMap: Record<string, keyof SubjectFormData> = {
    name: "name",
    department: "department",
    description: "description",
    hoursperweek: "hoursPerWeek",
    passscore: "passScore",
    classes: "classes",
    iscore: "isCore",
  };

  /* ---------------- File Parsing ---------------- */
  // ---------------- File Parsing ----------------

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
      const normalized: SubjectFormData[] = rawRows.map((row) => {
        const mapped: any = {};
        Object.keys(row).forEach((key) => {
          const clean = key.trim().toLowerCase().replace(/\s+/g, "");
          mapped[clean] = row[key];
        });

        return {
          name: (mapped.name ?? "").toString().trim(),
          description: (mapped.description ?? "").toString().trim(),
          department: (mapped.department ?? "").toString().trim(),
          classes: (mapped.classes ?? "").toString().trim(), // e.g. "JSS1,JSS2,SS1"
          passScore: mapped.passscore ? Number(mapped.passscore) : undefined,
          hoursPerWeek: mapped.hoursperweek
            ? Number(mapped.hoursperweek)
            : undefined,
          isCore: String(mapped.iscore).toLowerCase() === "true",
        };
      });

      // ✅ Validate with SS class rule
      const validated: ImportedSubject[] = normalized.map((item: any) => {
        const errors: string[] = [];

        if (!item.name) errors.push("Subject name is required");
        if (!item.classes) errors.push("Classes are required");

        const classList = item.classes
          .split(",")
          .map((c: any) => c.trim().toUpperCase())
          .filter(Boolean);

        const hasSenior = classList.some((c: any) =>
          ["SS1", "SS2", "SS3"].includes(c)
        );

        if (hasSenior && !item.department)
          errors.push("Department is required for SS1–SS3 subjects");

        return {
          ...item,
          status: errors.length ? "error" : "valid",
          errors,
        };
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
    const url = `${env.NEXT_PUBLIC_BACKEND_URL}/templates/subject-import-template.xlsx`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "subject-import-template.xlsx";
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
      "name",
      "department",
      "description",
      "hoursPerWeek",
      "passScore",
      "classes",
      "isCore",
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
    a.download = `subject-import-errors_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${errors.length} error rows`);
  };

  /* ---------------- Import ---------------- */

  const handleImport = () => {
    startTransition(async () => {
      try {
        const validSubjects = importedData
          .filter((s) => s.status === "valid" && s.errors.length === 0)
          .map((s) => ({
            name: s.name,
            department: s.department || "GENERAL",
            description: s.description,
            hoursPerWeek: s.hoursPerWeek,
            passScore: s.passScore,
            classes: s.classes,
            isCore: s.isCore,
          }));

        if (validSubjects.length === 0) {
          toast.error("No valid subject records to import.");
          return;
        }

        const res = await api.post(
          `/subjects/${user?.school?.schoolID}/import`,
          { subjects: validSubjects }
        );

        const createdCount = res.data.results?.length || 0;
        const failedCount = res.data.errors?.length || 0;

        toast.success(`${createdCount} subjects imported successfully.`);

        if (failedCount > 0) {
          const errorMessages = res.data.errors
            .map((err: any) => `${err.name}: ${err.error}`)
            .join("\n");

          toast.warning(`${failedCount} records failed to import.`);
          toast.error(errorMessages, { duration: 6000 });
        }

        // router.push("/a/subjects");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        // setShowPreview(false);
        // setImportedData([]);
      }
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-base">Import Subjects</h3>
          <p className="text-sm text-muted-foreground">
            Upload a file containing subject details
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
            <p className="font-medium text-md md:text-lg">
              Upload Subject Data
            </p>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Hours/Week</TableHead>
                        <TableHead>Pass Score</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Is Core</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {importedData.map((s, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              {s.status === "valid" ? (
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
                            <TableCell>{s.name}</TableCell>
                            <TableCell className="uppercase">
                              {s.department ?? "—"}
                            </TableCell>
                            <TableCell>{s.hoursPerWeek ?? "—"}</TableCell>
                            <TableCell>{s.passScore ?? "—"}</TableCell>
                            <TableCell>{s.classes ?? "—"}</TableCell>
                            <TableCell>{s.isCore ? "TRUE" : "FALSE"}</TableCell>
                            <TableCell>
                              {s.status === "error" ? (
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
                                    {s.errors.length} issue
                                    {s.errors.length > 1 ? "s" : ""}
                                  </span>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>

                          {s.status === "error" && expandedRows[index] && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-red-50">
                                <div className="p-3 rounded">
                                  <strong className="text-sm text-destructive">
                                    Row errors:
                                  </strong>
                                  <ul className="mt-2 ml-4 list-disc text-sm text-destructive">
                                    {s.errors.map((err, i) => (
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
                onClick={() => router.push("/a/subjects")}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button disabled={pending} onClick={handleImport}>
                {pending ? (
                  <Loader text="Importing..." />
                ) : (
                  `Import ${importedData.length} subjects`
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
