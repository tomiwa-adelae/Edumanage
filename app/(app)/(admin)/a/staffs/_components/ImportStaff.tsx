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
import { StaffImportSchema } from "@/lib/zodSchema";
import { useAuth } from "@/store/useAuth";

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  dob?: string;
  gender?: string;
  class?: string;
  section?: string;
  admissionNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  parentFirstName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentPhone?: string;
  parentRelationship?: string;
}

interface ImportedStaff extends StaffFormData {
  status: "valid" | "error" | "warning";
  errors: string[];
}

export const ImportStaff = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const [importedData, setImportedData] = useState<ImportedStaff[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

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
      return v; // fallback keep raw
    }
    // excel stores as days since 1899-12-30
    const serial = Number(v);
    if (Number.isNaN(serial)) return undefined;
    const ms = (serial - 25569) * 86400 * 1000;
    const d = new Date(ms);
    return d.toISOString().slice(0, 10);
  };

  // Normalize phone: handle numbers, scientific, remove non-digits, optional add leading 0 heuristic
  const normalizePhone = (raw: any) => {
    if (raw === undefined || raw === null) return "";
    let s = String(raw).trim();

    // Excel may give us a number or scientific notation; Number() handles both
    if (!isNaN(Number(s))) {
      // toFixed(0) removes decimals and scientific
      s = Number(s).toFixed(0);
    }

    // remove non-digits
    s = s.replace(/[^\d]/g, "");

    // If number looks like local 10-digit without leading zero (e.g. 8031234567),
    // and starts with 7/8/9 -> optionally add leading '0' (common in NG). This is heuristic.
    if (s.length === 10 && /^[789]/.test(s)) s = "0" + s;

    return s;
  };

  // Validate phone length (7 to 15 digits)
  const isValidPhone = (s: string) => s.length >= 7 && s.length <= 15;

  // Map many header variants to our canonical keys
  const headerMap: Record<string, keyof StaffFormData> = {
    // names
    firstname: "firstName",
    "first name": "firstName",
    lastname: "lastName",
    "last name": "lastName",
    // contact
    email: "email",
    emailaddress: "email",
    // phone
    phonenumber: "phoneNumber",
    phone: "phoneNumber",
    mobile: "phoneNumber",
    "mobile number": "phoneNumber",
    telephone: "phoneNumber",
    // role/class
    role: "role",
    class: "class",
    section: "section",
    admissionnumber: "admissionNumber",
    "admission number": "admissionNumber",
    // address
    address: "address",
    city: "city",
    state: "state",
    // dob
    dob: "dob",
    // gender
    gender: "gender",
    // parent fields (if present)
    parentfirstname: "parentFirstName",
    "parent first name": "parentFirstName",
    parentlastname: "parentLastName",
    "parent last name": "parentLastName",
    parentemail: "parentEmail",
    parentphone: "parentPhone",
    parentrelationship: "parentRelationship",
    // medical / emergency
    medicalconditions: "medicalConditions",
    emergencycontact: "emergencyContact",
    emergencyphone: "emergencyPhone",
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
      "email",
      "role",
      "phoneNumber",
      "dob",
      "gender",
      "class",
      "section",
      "admissionNumber",
      "address",
      "city",
      "state",
      "medicalConditions",
      "emergencyContact",
      "emergencyPhone",
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
    a.download = `staff-import-errors_${new Date().toISOString()}.csv`;
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
        // Excel: use FileReader (works in browser)
        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // defval: "" -> ensure empty cells are empty strings, raw:false let dates be serial sometimes
        rawRows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      }

      if (!rawRows.length) {
        toast.error("No rows found in file");
        return;
      }

      // Normalize keys and map to StaffFormData
      const normalized: StaffFormData[] = rawRows.map((row) => {
        const mapped: any = {};

        // Build a lookup of normalized keys -> value
        Object.keys(row).forEach((k) => {
          const clean = normalizeKey(String(k));
          // first try headerMap direct lookup, else use cleaned key itself
          const mappedKey = headerMap[clean] ?? (clean as keyof StaffFormData);
          mapped[mappedKey] = row[k];
        });

        // Convert excel DOB numbers to ISO if necessary
        const dobVal = mapped.dob ?? mapped.dob ?? "";
        const dob = excelDateToISO(dobVal);

        // Normalize phone(s)
        const phone = normalizePhone(
          mapped.phoneNumber ?? mapped.phone ?? mapped.mobile ?? ""
        );

        const emergencyPhone = normalizePhone(
          mapped.emergencyPhone ?? mapped.emergencyphone ?? ""
        );

        return {
          firstName: (mapped.firstName ?? "").toString().trim(),
          lastName: (mapped.lastName ?? "").toString().trim(),
          email: (mapped.email ?? "").toString().trim(),
          phoneNumber: phone,
          role: (mapped.role ?? "").toString().trim(),
          dob: dob ?? "",
          gender: (mapped.gender ?? "").toString().trim(),
          class: (mapped.class ?? "").toString().trim(),
          section: (mapped.section ?? "").toString().trim(),
          admissionNumber: (
            mapped.admissionNumber ??
            mapped.admissionnumber ??
            ""
          )
            .toString()
            .trim(),
          address: (mapped.address ?? "").toString().trim(),
          city: (mapped.city ?? "").toString().trim(),
          state: (mapped.state ?? "").toString().trim(),
          medicalConditions: (
            mapped.medicalConditions ??
            mapped.medicalconditions ??
            ""
          )
            .toString()
            .trim(),
          emergencyContact: (
            mapped.emergencyContact ??
            mapped.emergencycontact ??
            ""
          )
            .toString()
            .trim(),
          emergencyPhone: emergencyPhone,
          parentFirstName: (
            mapped.parentFirstName ??
            mapped.parentfirstname ??
            ""
          )
            .toString()
            .trim(),
          parentLastName: (mapped.parentLastName ?? mapped.parentlastname ?? "")
            .toString()
            .trim(),
          parentEmail: (mapped.parentEmail ?? mapped.parentemail ?? "")
            .toString()
            .trim(),
          parentPhone: normalizePhone(
            mapped.parentPhone ?? mapped.parentphone ?? ""
          ),
          parentRelationship: (
            mapped.parentRelationship ??
            mapped.parentrelationship ??
            ""
          )
            .toString()
            .trim(),
        } as StaffFormData;
      });

      // Validate and set statuses + errors
      const validated: ImportedStaff[] = normalized.map((item) => {
        const errors: string[] = [];

        if (!item.firstName) errors.push("firstName is required");
        if (!item.lastName) errors.push("lastName is required");

        if (!item.email || !/^\S+@\S+\.\S+$/.test(item.email))
          errors.push("Invalid email");

        if (!item.phoneNumber || !isValidPhone(item.phoneNumber))
          errors.push("Invalid phone (must be 7–15 digits)");

        // optionally require role
        if (!item.role) errors.push("role is required");

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
    const url = `${env.NEXT_PUBLIC_BACKEND_URL}/templates/staff-import-template.xlsx`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff-import-template.xlsx";
    a.click();
    toast.success("Template downloaded successfully!");
  };

  const validateImportedData = (data: any[]) => {
    const validEntries: any[] = [];
    const invalidEntries: { row: number; errors: string[] }[] = [];

    data.forEach((row, index) => {
      const result = StaffImportSchema.safeParse(row);
      if (result.success) {
        validEntries.push(result.data);
      } else {
        invalidEntries.push({
          row: index + 2, // +2 for Excel header offset
          // @ts-ignore
          errors: result?.error?.errors?.map((e: any) => e.message),
        });
      }
    });

    return { validEntries, invalidEntries };
  };

  const handleImport = () => {
    startTransition(async () => {
      try {
        const validStaff = importedData
          .filter(
            (staff) => staff.status === "valid" && staff.errors.length === 0
          )
          .map((staff) => ({
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            phoneNumber: staff.phoneNumber,
            role: staff.role,
            gender: staff.gender,
            dob: staff.dob, // ✅ rename dob → dob
            address: staff.address,
            city: staff.city,
            state: staff.state,
          }));

        if (validStaff.length === 0) {
          toast.error("No valid staff records to import.");
          return;
        }

        const res = await api.post(
          `/schools/${user?.school?.schoolID}/staff/bulk`,
          { staff: validStaff }
        );

        toast.success(res.data.message);
        if (res.data.failed?.length) {
          toast.warning(`${res.data.failed.length} records failed.`);
        }

        router.push("/a/staffs");
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
            Import Staffs from Excel/CSV
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload a file containing staff data
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
            <p className="font-medium text-md:md:text-lg">Upload Staff Data</p>
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
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {importedData.map((staff, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              {staff.status === "valid" ? (
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
                              {staff.firstName} {staff.lastName}
                            </TableCell>
                            <TableCell>{staff.email}</TableCell>
                            <TableCell>{staff.phoneNumber}</TableCell>
                            <TableCell className="uppercase">
                              {staff.role}
                            </TableCell>

                            <TableCell>
                              {staff.status === "error" ? (
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
                                    {staff.errors.length} issue
                                    {staff.errors.length > 1 ? "s" : ""}
                                  </span>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>

                          {staff.status === "error" && expandedRows[index] && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-red-50">
                                <div className="p-3 rounded">
                                  <strong className="text-sm text-destructive">
                                    Row errors:
                                  </strong>
                                  <ul className="mt-2 ml-4 list-disc text-sm text-destructive">
                                    {staff.errors.map((err, i) => (
                                      <li key={i}>{err}</li>
                                    ))}
                                  </ul>

                                  <div className="mt-3 flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          staff.errors.join("; ")
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
                  `Import ${importedData.length} staffs`
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
