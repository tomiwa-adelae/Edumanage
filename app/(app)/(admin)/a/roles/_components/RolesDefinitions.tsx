"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconBook,
  IconBooks,
  IconChartHistogram,
  IconCircleCheck,
  IconCurrencyDinar,
  IconDeviceLaptop,
  IconEye,
  IconFileDescription,
  IconSchool,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

interface Props {
  teachers: number;
  admins: number;
  students: number;
  parents: number;
}

export const RolesDefinitions = ({
  teachers,
  admins,
  students,
  parents,
}: Props) => {
  const roles = [
    {
      icon: Shield,
      role: "Administrator",
      description:
        "Full system access with all administrative privileges and system configuration",
      permissions: [
        "Full System Access",
        "User Management",
        "Role Assignment",
        "System Configuration",
        "Security Settings",
      ],
      capabilities: [
        "Create and manage all users",
        "Configure system settings",
        "Assign roles and permissions",
        "View all reports and analytics",
        "Manage school profile",
        "Access audit logs",
      ],
      users: admins,
      borderColor: "border-purple-200",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-800",
    },
    {
      icon: IconSchool,
      role: "Teacher",
      description:
        "Access to class management, grading, attendance, and student records",
      permissions: [
        "View Students",
        "Manage Grades",
        "Manage Attendance",
        "Create Assignments",
        "View Timetable",
        "Manage Behavior Notes",
        "Communication Access",
        "View Class Reports",
      ],
      capabilities: [
        "Mark attendance for assigned classes",
        "Enter and modify grades",
        "Create and manage assignments",
        "Add behavior notes",
        "Communicate with students and parents",
        "View class performance reports",
      ],
      users: teachers,
      borderColor: "border-blue-200",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-800",
    },
    {
      icon: IconBook,
      role: "Student",
      description:
        "Access to personal dashboard, grades, assignments, and timetable",
      permissions: [
        "View Own Records",
        "Submit Assignments",
        "View Grades",
        "View Timetable",
        "View Attendance",
        "Message Teachers",
        "Access Library",
      ],
      capabilities: [
        "View personal grades and reports",
        "Submit assignments online",
        "Check attendance records",
        "View class timetable",
        "Communicate with teachers",
        "Access library resources",
      ],
      users: students,
      borderColor: "border-green-200",
      bgColor: "bg-green-500/10",
      textColor: "text-green-800",
    },
    {
      icon: IconUsers,
      role: "Parent",
      description:
        "Access to child progress, fees, attendance, and teacher communication",
      permissions: [
        "View Child Records",
        "Make Payments",
        "Message Teachers",
        "View Attendance",
        "View Grades",
        "View Fee Statement",
        "Download Reports",
      ],
      capabilities: [
        "Monitor child academic progress",
        "Pay fees online",
        "View attendance records",
        "Communicate with teachers",
        "Download report cards",
        "View fee statements",
      ],
      users: parents,
      borderColor: "border-orange-200",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-800",
    },
    {
      icon: IconFileDescription,
      role: "Exam Officer",
      description:
        "Manage exams, schedules, invigilation, and examination records",
      permissions: [
        "Manage Exams",
        "View All Grades",
        "Generate Reports",
        "Schedule Exams",
        "Manage Exam Venues",
        "Assign Invigilators",
        "Export Results",
      ],
      capabilities: [
        "Create and schedule examinations",
        "Manage exam venues and logistics",
        "Assign invigilators",
        "View all exam results",
        "Generate result sheets",
        "Export examination data",
      ],
      users: 2,
      borderColor: "border-red-200",
      bgColor: "bg-red-500/10",
      textColor: "text-red-800",
    },
    {
      icon: IconCurrencyDinar,
      role: "Bursar",
      description:
        "Financial management, fee collection, and financial reporting",
      permissions: [
        "Manage Fees",
        "View Payments",
        "Financial Reports",
        "Configure Fee Structure",
        "Process Refunds",
        "Generate Invoices",
        "View All Transactions",
      ],
      capabilities: [
        "Configure school fee structure",
        "Process fee payments",
        "Generate financial reports",
        "Issue receipts and invoices",
        "Process refunds",
        "View all financial transactions",
      ],
      users: 2,
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-800",
    },
    {
      icon: IconDeviceLaptop,
      role: "IT Support",
      description: "Technical support, system maintenance, and user assistance",
      permissions: [
        "System Settings",
        "User Support",
        "Technical Logs",
        "Password Reset",
        "Troubleshoot Issues",
        "System Monitoring",
        "Backup Management",
      ],
      capabilities: [
        "Reset user passwords",
        "Troubleshoot technical issues",
        "Monitor system performance",
        "Manage system backups",
        "View system logs",
        "Provide user support",
      ],
      users: 3,
      borderColor: "border-cyan-200",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-800",
    },
    {
      icon: IconChartHistogram,
      role: "Data Analyst",
      description:
        "Access to analytics, reports, data insights, and statistical analysis",
      permissions: [
        "View All Reports",
        "Generate Analytics",
        "Export Data",
        "Custom Reports",
        "Statistical Analysis",
        "Data Visualization",
        "Trend Analysis",
      ],
      capabilities: [
        "Generate comprehensive reports",
        "Analyze student performance trends",
        "Create data visualizations",
        "Export data for analysis",
        "Perform statistical analysis",
        "Create custom reports",
      ],
      users: 2,
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-800",
    },
    {
      icon: IconBooks,
      role: "Librarian",
      description:
        "Library management, book loans, resource catalog, and inventory",
      permissions: [
        "Manage Library",
        "Book Loans",
        "Resource Catalog",
        "Inventory Management",
        "Issue Books",
        "Track Returns",
        "Fine Management",
      ],
      capabilities: [
        "Manage library catalog",
        "Issue and return books",
        "Track book loans",
        "Manage library inventory",
        "Calculate and collect fines",
        "Generate library reports",
      ],
      users: 2,
      borderColor: "border-amber-200",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-800",
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState<any>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Definitions</CardTitle>
        <CardDescription>
          Overview of all available roles and their permissions in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <div
              key={index}
              className={cn(
                "border rounded-md max-w-full overflow-hidden p-3 flex flex-col md:flex-row items-start justify-between gap-4",
                role.borderColor
              )}
            >
              <div className="flex items-start justify-between gap-4 max-w-full overflow-hidden">
                <div
                  className={cn(`rounded-md p-3 inline-block`, role.bgColor)}
                >
                  <Icon className={cn(`h-6 w-6`, role.textColor)} />
                </div>
                <div className="flex-1 max-w-full overflow-hidden space-y-2">
                  <div>
                    <p className="text-base font-medium">
                      <span>{role.role}</span>{" "}
                      <Badge variant={"outline"}>{role.users} users</Badge>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {role.description}
                    </p>
                  </div>
                  <div className="space-y-1 max-w-full overflow-hidden">
                    <p className="text-xs text-muted-foreground">
                      Key Permissions:
                    </p>
                    <div className="relative w-full max-w-full">
                      <div className="flex gap-1 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
                        {role.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="secondary">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setOpenModal(true);
                  setRole(role);
                }}
                className="w-full md:w-auto"
                variant={"outline"}
              >
                <IconEye />
                View Details
              </Button>
            </div>
          );
        })}
      </CardContent>
      {role && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="flex  h-screen flex-col gap-0 p-0 overflow-hidden max-h-[70vh] max-w-[90vw] sm:max-w-xl sm:max-h-[min(640px,80vh)] [&>button:last-child]:top-3.5">
            <DialogHeader className="contents overflow-y-auto custom-scroll space-y-0 text-left">
              <div className="px-6 py-4 space-y-1">
                <DialogTitle className="text-base flex items-center justify-start gap-2">
                  <div
                    className={cn(`rounded-md p-3 inline-block`, role.bgColor)}
                  >
                    <role.icon className={cn(`h-6 w-6`, role.textColor)} />
                  </div>
                  {role.role} Role
                </DialogTitle>
                <DialogDescription>{role.description}</DialogDescription>
              </div>
              <div className="overflow-y-auto px-4 space-y-4 pb-10">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center flex-col border rounded-md p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Active Users
                    </p>
                    <p className="font-medium text-xl">{role.users}</p>
                  </div>
                  <div className="flex items-center justify-center flex-col border rounded-md p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Permissions</p>
                    <p className="font-medium text-xl">
                      {role.permissions.length}
                    </p>
                  </div>
                  <div className="flex items-center justify-center flex-col border rounded-md p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Capacities</p>
                    <p className="font-medium text-xl">
                      {role.capabilities.length}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-medium text-sm font-medium">Permissions</p>
                  <p className="text-xs text-muted-foreground">
                    This role has access to the following system permissions:
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {role.permissions.map((permission: string) => (
                      <div className="px-2 py-3 rounded-md text-sm flex items-center justify-start gap-1 bg-muted">
                        <IconCircleCheck className="size-4 text-green-500" />{" "}
                        <p>{permission}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-medium text-sm font-medium">
                    Key Capabilities
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Users with this role can perform the following actions:
                  </p>
                  <div className="mt-2 grid gap-2">
                    {role.capabilities.map((c: string, index: string) => (
                      <div
                        key={index}
                        className="px-2 py-3 rounded-md text-sm flex items-center justify-start gap-1 bg-muted"
                      >
                        <IconCircleCheck className="size-4 text-primary" />{" "}
                        <p>{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="border space-y-1 border-primary/20 rounded-md bg-primary/10 p-4">
                  <p className="text-xs font-medium">Role Assignment</p>
                  <p className="text-xs text-muted-foreground">
                    This role can be assigned to users from the "Users & Roles"
                    tab. Role changes take effect immediately and are logged for
                    audit purposes.
                  </p>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
