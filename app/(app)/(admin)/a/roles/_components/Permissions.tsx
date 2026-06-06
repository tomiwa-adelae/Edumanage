import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { Check, X } from "lucide-react";
import React from "react";

const PermissionTable = ({ title, roles, permissions }: any) => {
  return (
    <Card className="gap-2.5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">
                  Permission
                </th>
                {roles.map((role: any) => (
                  <th
                    key={role}
                    className="text-center py-3 px-4 font-medium text-sm whitespace-nowrap"
                  >
                    <Badge variant="outline">{role}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission: any, idx: number) => (
                <tr
                  key={permission.name}
                  className={idx !== permissions.length - 1 ? "border-b" : ""}
                >
                  <td className="py-3 px-4 text-sm">{permission.name}</td>
                  {roles.map((role: string) => (
                    <td key={role} className="py-3 px-4 text-center">
                      {permission.access[role] ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                          <X className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const roles = [
  "Administrator",
  "Teacher",
  "Student",
  "Parent",
  "Exam Officer",
  "Bursar",
  "IT Support",
  "Data Analyst",
  "Librarian",
];

export const UserManagement = () => {
  const userPermissions = [
    {
      name: "View Users",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: true,
        "IT Support": true,
        "Data Analyst": false,
        Librarian: true,
      },
    },
    {
      name: "Create Users",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Edit Users",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Delete Users",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Assign Roles",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="User Management"
      roles={roles}
      permissions={userPermissions}
    />
  );
};

export const StudentManagement = () => {
  const studentPermissions = [
    {
      name: "View Students",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: true,
      },
    },
    {
      name: "Add Students",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Edit Students",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Delete Students",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Approve Students",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Student Management"
      roles={roles}
      permissions={studentPermissions}
    />
  );
};

export const AcademicManagement = () => {
  const academicPermissions = [
    {
      name: "View Grades",
      access: {
        Administrator: true,
        Teacher: true,
        Student: true,
        Parent: true,
        "Exam Officer": true,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
    {
      name: "Edit Grades",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Create Assignments",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Timetable",
      access: {
        Administrator: true,
        Teacher: true,
        Student: true,
        Parent: true,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Edit Timetable",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Academic Management"
      roles={roles}
      permissions={academicPermissions}
    />
  );
};

export const FinancialManagement = () => {
  const financialPermissions = [
    {
      name: "View Fees",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: true,
        "Exam Officer": false,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Configure Fees",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Process Payments",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: true,
        "Exam Officer": false,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Transactions",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: true,
        "Exam Officer": false,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Generate Invoices",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Financial Management"
      roles={roles}
      permissions={financialPermissions}
    />
  );
};

export const ExamManagement = () => {
  const examPermissions = [
    {
      name: "Create Exams",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Schedule Exams",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Results",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
    {
      name: "Enter Results",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Generate Reports",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Exam Management"
      roles={roles}
      permissions={examPermissions}
    />
  );
};

export const Communication = () => {
  const communicationPermissions = [
    {
      name: "Send Messages",
      access: {
        Administrator: true,
        Teacher: true,
        Student: true,
        Parent: true,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Messages",
      access: {
        Administrator: true,
        Teacher: true,
        Student: true,
        Parent: true,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Send Announcements",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Manage Notifications",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Communication"
      roles={roles}
      permissions={communicationPermissions}
    />
  );
};

export const ReportsAnalytics = () => {
  const reportsPermissions = [
    {
      name: "View Reports",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: true,
      },
    },
    {
      name: "Generate Reports",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
    {
      name: "Export Data",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": true,
        Bursar: true,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
    {
      name: "View Analytics",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
    {
      name: "Custom Reports",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": true,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Reports & Analytics"
      roles={roles}
      permissions={reportsPermissions}
    />
  );
};

export const SystemAdministration = () => {
  const systemPermissions = [
    {
      name: "System Settings",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": true,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Backup Data",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": true,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Logs",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": true,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Manage Integrations",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": true,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Security Settings",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": true,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="System Administration"
      roles={roles}
      permissions={systemPermissions}
    />
  );
};

export const LibraryManagement = () => {
  const libraryPermissions = [
    {
      name: "Manage Catalog",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: true,
      },
    },
    {
      name: "Issue Books",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: true,
      },
    },
    {
      name: "Track Loans",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: true,
      },
    },
    {
      name: "Manage Inventory",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: true,
      },
    },
  ];

  return (
    <PermissionTable
      title="Library Management"
      roles={roles}
      permissions={libraryPermissions}
    />
  );
};

export const Attendance = () => {
  const attendancePermissions = [
    {
      name: "Mark Attendance",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Attendance",
      access: {
        Administrator: true,
        Teacher: true,
        Student: true,
        Parent: true,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Edit Attendance",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Attendance Reports",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Attendance"
      roles={roles}
      permissions={attendancePermissions}
    />
  );
};

export const ClassManagement = () => {
  const classPermissions = [
    {
      name: "Create Classes",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Edit Classes",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Assign Teachers",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Class Lists",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Manage Subjects",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Class Management"
      roles={roles}
      permissions={classPermissions}
    />
  );
};

export const BehaviorDiscipline = () => {
  const behaviorPermissions = [
    {
      name: "Add Behavior Notes",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "View Behavior Records",
      access: {
        Administrator: true,
        Teacher: true,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Issue Warnings",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
    {
      name: "Manage Incidents",
      access: {
        Administrator: true,
        Teacher: false,
        Student: false,
        Parent: false,
        "Exam Officer": false,
        Bursar: false,
        "IT Support": false,
        "Data Analyst": false,
        Librarian: false,
      },
    },
  ];

  return (
    <PermissionTable
      title="Behavior & Discipline"
      roles={roles}
      permissions={behaviorPermissions}
    />
  );
};

// Summary Stats Component
const SummaryStats = ({ categories, permissions, roles, showing }: any) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">
          Total Categories
        </div>
        <div className="text-3xl lg:text-4xl font-medium">{categories}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">
          Total Permissions
        </div>
        <div className="text-3xl lg:text-4xl font-medium">{permissions}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Total Roles</div>
        <div className="text-3xl lg:text-4xl font-medium">{roles}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Showing</div>
        <div className="text-3xl lg:text-4xl font-medium">{showing}</div>
      </div>
    </div>
  );
};

// Demo component showing all tables
export function Permissions() {
  const totalCategories = 12;
  const totalPermissions = 56;
  const totalRoles = 9;
  const showing = 12;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions Matrix</CardTitle>
        <CardDescription>
          View and understand which permissions are granted to each role
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchBarWrapper />
        <div className="flex items-center justify-start bg-muted p-3 rounded-md gap-4">
          <div className="flex items-center justify-start gap-1 text-sm">
            <IconCircleCheck className="size-4 text-green-500" />
            <p>Has Permission</p>
          </div>
          <div className="flex items-center text-muted-foreground justify-start gap-1 text-sm">
            <IconCircleX className="size-4" />
            <p>No Permission</p>
          </div>
        </div>
        <UserManagement />
        <StudentManagement />
        <AcademicManagement />
        <FinancialManagement />
        <ExamManagement />
        <Communication />
        <ReportsAnalytics />
        <SystemAdministration />
        <LibraryManagement />
        <Attendance />
        <ClassManagement />
        <BehaviorDiscipline />
        <Separator />
        <SummaryStats
          categories={totalCategories}
          permissions={totalPermissions}
          roles={totalRoles}
          showing={showing}
        />
      </CardContent>
    </Card>
  );
}
