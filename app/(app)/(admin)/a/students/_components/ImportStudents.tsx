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
  IconBulb,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StudentFormData {
  firstName: string;
  lastName: string;
  otherName: string;
  candidateNumber: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  medicalConditions?: string;
  examScore?: string;
  primarySchoolName?: string;
  LGA?: string;

  // Class fields
  classLevel: string;
  classSection: string;

  // Parent fields
  parentFirstName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentPhoneNumber?: string;
  parentRelationship?: string;
}

interface ImportedStudent extends StudentFormData {
  status: "valid" | "error" | "warning";
  errors: string[];
  errorType?: string;
  suggestion?: string;
}

export const ImportStudents = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const [importedData, setImportedData] = useState<ImportedStudent[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [importSummary, setImportSummary] = useState<any>(null);

  const toggleRow = (idx: number) =>
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));

  /* ---------------- helpers ---------------- */

  // Normalize header keys: "First Name" -> "firstname"
  const normalizeKey = (k: string) =>
    k.trim().toLowerCase().replace(/\s+/g, "");

  // Excel serial date to JS ISO string
  const excelDateToISO = (v: number | string): string | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    if (typeof v === "string") {
      const parsed = Date.parse(v);
      if (!isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
      return v;
    }
    const serial = Number(v);
    if (Number.isNaN(serial)) return undefined;
    const ms = (serial - 25569) * 86400 * 1000;
    const d = new Date(ms);
    return d.toISOString().slice(0, 10);
  };

  // Normalize phone
  const normalizePhone = (raw: any) => {
    if (raw === undefined || raw === null) return "";
    let s = String(raw).trim();

    if (!isNaN(Number(s))) {
      s = Number(s).toFixed(0);
    }

    s = s.replace(/[^\d]/g, "");

    if (s.length === 10 && /^[789]/.test(s)) s = "0" + s;

    return s;
  };

  const isValidPhone = (s: string) => s.length >= 7 && s.length <= 15;

  // Map many header variants to our canonical keys
  const headerMap: Record<string, keyof StudentFormData> = {
    // names
    firstname: "firstName",
    "first name": "firstName",
    lastname: "lastName",
    "last name": "lastName",
    othername: "otherName",
    "other name": "otherName",
    middlename: "otherName",
    "middle name": "otherName",

    // student specific
    candidatenumber: "candidateNumber",
    "candidate number": "candidateNumber",
    studentid: "candidateNumber",
    "student id": "candidateNumber",

    // contact
    email: "email",
    emailaddress: "email",
    "email address": "email",

    phonenumber: "phoneNumber",
    phone: "phoneNumber",
    mobile: "phoneNumber",
    "mobile number": "phoneNumber",

    // personal
    gender: "gender",
    dob: "dob",
    dateofbirth: "dob",
    "date of birth": "dob",

    // address
    address: "address",
    city: "city",
    state: "state",
    country: "country",

    // medical/emergency
    medicalconditions: "medicalConditions",
    "medical conditions": "medicalConditions",

    // academic
    examscore: "examScore",
    "exam score": "examScore",
    primaryschoolname: "primarySchoolName",
    "primary school name": "primarySchoolName",
    "primary school": "primarySchoolName",
    lga: "LGA",

    // class
    classlevel: "classLevel",
    "class level": "classLevel",
    level: "classLevel",
    class: "classLevel",
    classsection: "classSection",
    "class section": "classSection",
    section: "classSection",

    // parent
    parentfirstname: "parentFirstName",
    "parent first name": "parentFirstName",
    parentlastname: "parentLastName",
    "parent last name": "parentLastName",
    parentemail: "parentEmail",
    "parent email": "parentEmail",
    parentphonenumber: "parentPhoneNumber",
    "parent phone number": "parentPhoneNumber",
    parentphone: "parentPhoneNumber",
    parentrelationship: "parentRelationship",
    "parent relationship": "parentRelationship",
    relationship: "parentRelationship",
  };

  /* ---------------- download errors csv ---------------- */

  const downloadErrorsCsv = () => {
    const errors = importedData.filter((r) => r.status === "error");
    if (errors.length === 0) {
      toast.error("No error rows to export");
      return;
    }

    const headers = [
      "firstName",
      "lastName",
      "otherName",
      "candidateNumber",
      "email",
      "phoneNumber",
      "gender",
      "dob",
      "address",
      "city",
      "state",
      "country",
      "classLevel",
      "classSection",
      "parentFirstName",
      "parentLastName",
      "parentEmail",
      "parentPhoneNumber",
      "parentRelationship",
      "errors",
      "suggestion",
    ];

    const rows = errors.map((r) =>
      headers
        .map((h) => {
          if (h === "errors") return `"${(r.errors || []).join("; ")}"`;
          if (h === "suggestion") return `"${r.suggestion || ""}"`;
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
    a.download = `student-import-errors_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${errors.length} error rows`);
  };

  /* ---------------- file parsing ---------------- */

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
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rawRows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      }

      if (!rawRows.length) {
        toast.error("No rows found in file");
        return;
      }

      // Normalize keys and map to StudentFormData
      const normalized: StudentFormData[] = rawRows.map((row) => {
        const mapped: any = {};

        Object.keys(row).forEach((k) => {
          const clean = normalizeKey(String(k));
          const mappedKey =
            headerMap[clean] ?? (clean as keyof StudentFormData);
          mapped[mappedKey] = row[k];
        });

        // Convert excel DOB numbers to ISO
        const dobVal = mapped.dob ?? "";
        const dob = excelDateToISO(dobVal);

        // Normalize phones
        const phone = normalizePhone(mapped.phoneNumber ?? mapped.phone ?? "");
        const emergencyPhone = normalizePhone(
          mapped.emergencyPhoneNumber ?? ""
        );
        const parentPhone = normalizePhone(
          mapped.parentPhoneNumber ?? mapped.parentPhone ?? ""
        );

        return {
          firstName: (mapped.firstName ?? "").toString().trim(),
          lastName: (mapped.lastName ?? "").toString().trim(),
          otherName: (mapped.otherName ?? "").toString().trim(),
          candidateNumber: (mapped.candidateNumber ?? "").toString().trim(),
          email: (mapped.email ?? "").toString().trim(),
          phoneNumber: phone,
          gender: (mapped.gender ?? "").toString().trim(),
          dob: dob ?? "",
          address: (mapped.address ?? "").toString().trim(),
          city: (mapped.city ?? "").toString().trim(),
          state: (mapped.state ?? "").toString().trim(),
          country: (mapped.country ?? "").toString().trim(),
          medicalConditions: (mapped.medicalConditions ?? "").toString().trim(),
          examScore: (mapped.examScore ?? "").toString().trim(),
          primarySchoolName: (mapped.primarySchoolName ?? "").toString().trim(),
          LGA: (mapped.LGA ?? mapped.lga ?? "").toString().trim(),
          classLevel: (mapped.classLevel ?? "").toString().trim(),
          classSection: (mapped.classSection ?? "").toString().trim(),
          parentFirstName: (mapped.parentFirstName ?? "").toString().trim(),
          parentLastName: (mapped.parentLastName ?? "").toString().trim(),
          parentEmail: (mapped.parentEmail ?? "").toString().trim(),
          parentPhoneNumber: parentPhone,
          parentRelationship: (mapped.parentRelationship ?? "")
            .toString()
            .trim(),
        } as StudentFormData;
      });

      // Validate and set statuses + errors
      const validated: ImportedStudent[] = normalized.map((item) => {
        const errors: string[] = [];

        // Required fields
        if (!item.firstName) errors.push("firstName is required");
        if (!item.lastName) errors.push("lastName is required");
        if (!item.otherName) errors.push("otherName is required");
        if (!item.candidateNumber) errors.push("candidateNumber is required");

        if (!item.email || !/^\S+@\S+\.\S+$/.test(item.email))
          errors.push("Invalid email");

        if (!item.classLevel) errors.push("classLevel is required");
        if (!item.classSection) errors.push("classSection is required");

        if (item.parentPhoneNumber && !isValidPhone(item.parentPhoneNumber))
          errors.push("Invalid parentPhoneNumber");

        // Validate parent email if provided
        if (item.parentEmail && !/^\S+@\S+\.\S+$/.test(item.parentEmail))
          errors.push("Invalid parent email");

        return {
          ...item,
          status: errors.length ? "error" : "valid",
          errors,
        };
      });

      setImportedData(validated);
      setShowPreview(true);
      toast.success(
        `Processed ${validated.length} rows — review before importing.`
      );
    } catch (err) {
      toast.error("Failed to parse file");
    }
  };

  const downloadTemplate = async () => {
    const url = `${env.NEXT_PUBLIC_BACKEND_URL}/templates/student-import-template.xlsx`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-import-template.xlsx";
    a.click();
    toast.success("Template downloaded successfully!");
  };

  const handleImport = () => {
    startTransition(async () => {
      try {
        const validStudents = importedData
          .filter(
            (student) =>
              student.status === "valid" && student.errors.length === 0
          )
          .map((student) => ({
            firstName: student.firstName,
            lastName: student.lastName,
            otherName: student.otherName,
            candidateNumber: student.candidateNumber,
            email: student.email,
            phoneNumber: student.phoneNumber,
            gender: student.gender,
            dob: student.dob,
            address: student.address,
            city: student.city,
            state: student.state,
            country: student.country,
            medicalConditions: student.medicalConditions,
            examScore: student.examScore,
            primarySchoolName: student.primarySchoolName,
            LGA: student.LGA,
            classLevel: student.classLevel,
            classSection: student.classSection,
            parentFirstName: student.parentFirstName,
            parentLastName: student.parentLastName,
            parentEmail: student.parentEmail,
            parentPhoneNumber: student.parentPhoneNumber,
            parentRelationship: student.parentRelationship,
          }));

        if (validStudents.length === 0) {
          toast.error("No valid student records to import.");
          return;
        }

        const res = await api.post(`/students/${user?.school?.id}/bulk`, {
          students: validStudents,
        });

        // Handle backend response with detailed errors
        if (res.data.failed && res.data.failed.length > 0) {
          // Merge backend errors into our imported data
          const updatedData = [...importedData];

          res.data.failed.forEach((failedItem: any) => {
            const index = updatedData.findIndex(
              (s) =>
                s.candidateNumber === failedItem.candidateNumber ||
                s.email === failedItem.email
            );

            if (index !== -1) {
              updatedData[index] = {
                ...updatedData[index],
                status: "error",
                errors: [failedItem.error],
                errorType: failedItem.errorType,
                suggestion: failedItem.suggestion,
              };
            }
          });

          setImportedData(updatedData);
          setImportSummary(res.data.summary);

          toast.warning(
            `${res.data.created?.length || 0} imported, ${
              res.data.failed.length
            } failed. Review errors below.`
          );
        } else {
          toast.success(res.data.message);
          setImportSummary(res.data.summary);

          // Only redirect if all were successful
          if (!res.data.failed?.length) {
            setTimeout(() => router.push("/a/students"), 1500);
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-base">
            Import Students from Excel/CSV
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload a file containing student data
          </p>
        </div>

        <div className="border p-3 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="flex text-sm text-muted-foreground items-center justify-start gap-1">
            <IconDownload className="size-4" />
            Download our template to ensure your data is formatted correctly
          </p>
          <Button
            onClick={downloadTemplate}
            className="w-full md:w-auto"
            variant={"outline"}
          >
            <IconDownload />
            Download Template
          </Button>
        </div>

        {!showPreview && (
          <div className="flex flex-col items-center justify-center gap-2.5 border-dashed border-2 px-6 py-10 rounded-md">
            <IconUpload />
            <p className="font-medium text-md:md:text-lg">
              Upload Student Data
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
            {/* Import Summary */}
            {importSummary && (
              <Alert>
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Import Summary:</strong>{" "}
                      {importSummary.successful} successful,{" "}
                      {importSummary.failed} failed
                    </span>
                    <Badge variant="outline">{importSummary.successRate}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ">
              <div>
                <h3 className="font-medium text-base">Preview Imported Data</h3>
                <p className="text-sm text-muted-foreground">
                  {importedData.filter((d) => d.status === "valid").length}{" "}
                  valid,{" "}
                  {importedData.filter((d) => d.status === "error").length}{" "}
                  errors
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadErrorsCsv}>
                  <IconDownload />
                  Export Errors
                </Button>

                <Button
                  onClick={() => {
                    setShowPreview(false);
                    setImportedData([]);
                    setImportSummary(null);
                  }}
                  variant={"outline"}
                  className="w-full sm:w-auto"
                >
                  <IconX />
                  Clear
                </Button>
              </div>
            </div>

            <Card className="gap-0">
              <CardContent>
                <div className="[&>div]:max-h-96">
                  <Table className="">
                    <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-xs">
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Candidate No.</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {importedData.map((student, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              {student.status === "valid" ? (
                                <Badge variant={"outlineSuccess"}>
                                  <IconCheck />
                                  Valid
                                </Badge>
                              ) : (
                                <Badge variant={"destructive"}>
                                  <IconAlertCircle />
                                  Error
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="font-medium">
                              {student.firstName} {student.lastName}
                            </TableCell>
                            <TableCell>{student.candidateNumber}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              {student.classLevel}
                              {student.classSection}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {student.parentEmail || "—"}
                            </TableCell>

                            <TableCell>
                              {student.status === "error" ? (
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
                                    {student.errors.length} issue
                                    {student.errors.length > 1 ? "s" : ""}
                                  </span>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>

                          {student.status === "error" &&
                            expandedRows[index] && (
                              <TableRow>
                                <TableCell colSpan={7} className="bg-red-50">
                                  <div className="p-3 rounded space-y-3">
                                    <div>
                                      <strong className="text-sm text-destructive">
                                        Row errors:
                                      </strong>
                                      <ul className="mt-2 ml-4 list-disc text-sm text-destructive">
                                        {student.errors.map((err, i) => (
                                          <li key={i}>{err}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Show suggestion if available */}
                                    {student.suggestion && (
                                      <Alert className="bg-blue-50 border-blue-200">
                                        <IconBulb className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-sm text-blue-800">
                                          <strong>Suggestion:</strong>{" "}
                                          {student.suggestion}
                                        </AlertDescription>
                                      </Alert>
                                    )}

                                    {/* Error type badge */}
                                    {student.errorType && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {student.errorType.replace(/_/g, " ")}
                                      </Badge>
                                    )}

                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const copyText = student.suggestion
                                            ? `${student.errors.join(
                                                "; "
                                              )}\n\nSuggestion: ${
                                                student.suggestion
                                              }`
                                            : student.errors.join("; ");
                                          navigator.clipboard.writeText(
                                            copyText
                                          );
                                          toast.success(
                                            "Errors copied to clipboard"
                                          );
                                        }}
                                      >
                                        Copy errors
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newData = [...importedData];
                                          newData[index] = {
                                            ...newData[index],
                                            status: "warning",
                                          };
                                          setImportedData(newData);
                                          toast.success("Marked as warning");
                                        }}
                                      >
                                        Mark as warning
                                      </Button>
                                    </div>
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
                onClick={() => router.back()}
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
              <Button disabled={pending} onClick={handleImport} type="button">
                {pending ? (
                  <Loader text="Importing..." />
                ) : (
                  `Import ${
                    importedData.filter((s) => s.status === "valid").length
                  } students`
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
