import {
  IconLayout,
  IconUserCheck,
  IconSchool,
  IconCalendar,
  IconBook,
  IconUsers,
  IconUserCog,
  IconShield,
  IconClipboardList,
  IconClock,
  IconCreditCard,
  IconChartHistogram,
  IconSettings,
  IconDownload,
  IconDeviceLaptop,
  IconDeviceImacUp,
  IconAlertCircle,
  IconFileDescription,
  IconMessage,
  IconServerBolt,
  IconUsersGroup,
  IconCurrencyDollar,
  IconChartInfographic,
  IconNotebook,
  IconTrendingUp,
  IconWallet,
  IconChalkboardTeacher,
  IconFileCertificate,
  IconFileText,
} from "@tabler/icons-react";

export const adminNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/a/dashboard",
        icon: IconLayout,
      },
      {
        title: "Students Approvals",
        url: "/a/students/approval",
        icon: IconUserCheck,
      },
    ],
  },
  {
    title: "School Setup",
    url: "#",
    icon: IconSchool,
    isActive: true,
    items: [
      {
        title: "School Profile",
        url: "/a/school",
        icon: IconSchool,
      },
      {
        title: "Academic Calendar",
        url: "/a/school/calendar",
        icon: IconCalendar,
        comingSoon: true,
      },
    ],
  },
  {
    title: "Management",
    url: "#",
    icon: IconUsers,
    items: [
      {
        title: "Students Management",
        url: "/a/students",
        icon: IconUsers,
      },
      {
        title: "Staff Management",
        url: "/a/staffs",
        icon: IconUserCog,
      },
      {
        title: "Teachers Management",
        url: "/a/teachers",
        icon: IconChalkboardTeacher,
      },
      {
        title: "Classes Management",
        url: "/a/classes",
        icon: IconBook,
      },
      {
        title: "Subjects Management",
        url: "/a/subjects",
        icon: IconSchool,
      },
      {
        title: "Roles & Permissions",
        url: "/a/roles",
        icon: IconShield,
      },
    ],
  },
  {
    title: "Academic",
    url: "#",
    icon: IconClipboardList,
    items: [
      {
        title: "Assessment Setup",
        url: "/a/assessment",
        icon: IconClipboardList,
        comingSoon: true,
      },
      {
        title: "Timetables",
        url: "/a/timetables",
        icon: IconClock,
      },
    ],
  },
  {
    title: "Finance",
    url: "#",
    icon: IconCreditCard,
    items: [
      {
        title: "Fees & Payments",
        url: "/a/fees",
        icon: IconCreditCard,
        comingSoon: true,
      },
      {
        title: "Reports",
        url: "/a/reports",
        icon: IconChartHistogram,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconDeviceLaptop,
    items: [
      {
        title: "Import",
        url: "/a/import",
        icon: IconDownload,
        comingSoon: true,
      },
      {
        title: "Settings",
        url: "/a/settings",
        icon: IconSettings,
      },
    ],
  },
];

export const teacherNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/t/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "Academic",
    url: "#",
    icon: IconFileDescription,
    isActive: true,
    items: [
      {
        title: "My Students",
        url: "/t/students",
        icon: IconUsers,
      },
      {
        title: "My Timetables",
        url: "/t/timetables",
        icon: IconClock,
      },
    ],
  },
  {
    title: "Daily Operations",
    url: "#",
    icon: IconUsers,
    isActive: true,
    items: [
      {
        title: "Mark Attendance",
        url: "/t/attendances",
        icon: IconUsers,
      },
      {
        title: "Enter Grades",
        url: "/t/grades",
        icon: IconDeviceImacUp,
        comingSoon: true,
      },
      {
        title: "Behavior Notes",
        url: "/t/behavior-notes",
        icon: IconAlertCircle,
        comingSoon: true,
      },
      {
        title: "Assignments & Lessons",
        url: "/t/assignments",
        icon: IconFileDescription,
      },
    ],
  },
  {
    title: "Communication",
    url: "#",
    icon: IconMessage,
    items: [
      {
        title: "Messages",
        url: "/messages",
        icon: IconMessage,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconDeviceLaptop,
    items: [
      {
        title: "Import",
        url: "/a/import",
        icon: IconDownload,
        comingSoon: true,
      },
      {
        title: "Settings",
        url: "/t/settings",
        icon: IconSettings,
      },
    ],
  },
];

export const ITSupportNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/t/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "System Management",
    url: "#",
    icon: IconUsers,
    isActive: true,
    items: [
      {
        title: "User Accounts",
        url: "/it/user-accounts",
        icon: IconUsers,
        comingSoon: true,
      },
      {
        title: "System Logs",
        url: "/it/system-logs",
        icon: IconFileDescription,
        comingSoon: true,
      },
      {
        title: "Backup & Recovery",
        url: "/it/backups",
        icon: IconServerBolt,
        comingSoon: true,
      },
    ],
  },
  {
    title: "Support",
    url: "#",
    icon: IconAlertCircle,
    items: [
      {
        title: "Support Tickets",
        url: "/it/tickets",
        icon: IconAlertCircle,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "Configuration",
        url: "/it/configuration",
        icon: IconSettings,
        comingSoon: true,
      },
    ],
  },
];

export const dataAnalystNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/da/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "Analytics",
    url: "#",
    icon: IconUsers,
    isActive: true,
    items: [
      {
        title: "Student Performance",
        url: "/da/students",
        icon: IconUsers,
        comingSoon: true,
      },
      {
        title: "Staff Analyst",
        url: "/da/staffs",
        icon: IconUsersGroup,
        comingSoon: true,
      },
      {
        title: "Attendance Trends",
        url: "/da/attendance",
        icon: IconClock,
        comingSoon: true,
      },
      {
        title: "Financial Analysis",
        url: "/da/financial",
        icon: IconCurrencyDollar,
        comingSoon: true,
      },
    ],
  },
  {
    title: "Reports",
    url: "#",
    icon: IconChartInfographic,
    items: [
      {
        title: "Custom Reports",
        url: "da/custom-reports",
        icon: IconChartInfographic,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "Configuration",
        url: "/da/configuration",
        icon: IconSettings,
        comingSoon: true,
      },
    ],
  },
];

export const librarianNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/l/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "Library Management",
    url: "#",
    icon: IconBook,
    isActive: true,
    items: [
      {
        title: "Book Catalog",
        url: "/l/books",
        icon: IconBook,
        comingSoon: true,
      },
      {
        title: "Lending & Returns",
        url: "/l/lending",
        icon: IconNotebook,
        comingSoon: true,
      },
      {
        title: "Library Members",
        url: "/l/members",
        icon: IconUsersGroup,
        comingSoon: true,
      },
      {
        title: "Overdue Books",
        url: "/l/overdue",
        icon: IconAlertCircle,
        comingSoon: true,
      },
    ],
  },
  {
    title: "Reports",
    url: "#",
    icon: IconChartInfographic,
    items: [
      {
        title: "Library Reports",
        url: "/l/reports",
        icon: IconChartInfographic,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "Configuration",
        url: "/da/configuration",
        icon: IconSettings,
        comingSoon: true,
      },
    ],
  },
];

export const bursarNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/b/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "Finance",
    url: "#",
    icon: IconCreditCard,
    isActive: true,
    items: [
      {
        title: "Book Catalog",
        url: "/b/fee-collection",
        icon: IconCreditCard,
        comingSoon: true,
      },
      {
        title: "Expense Management",
        url: "/b/expenses",
        icon: IconTrendingUp,
        comingSoon: true,
      },
      {
        title: "Salary Processing",
        url: "/b/salary",
        icon: IconWallet,
        comingSoon: true,
      },
      {
        title: "Budget Planning",
        url: "/b/budget",
        icon: IconCurrencyDollar,
        comingSoon: true,
      },
    ],
  },
  {
    title: "Reports",
    url: "#",
    icon: IconChartInfographic,
    items: [
      {
        title: "Financial Reports",
        url: "/b/financial",
        icon: IconChartInfographic,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "Configuration",
        url: "/da/configuration",
        icon: IconSettings,
        comingSoon: true,
      },
    ],
  },
];

export const studentNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/s/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "Academic",
    url: "#",
    icon: IconFileDescription,
    isActive: true,
    items: [
      {
        title: "My Assignments",
        url: "/s/assignments",
        icon: IconFileDescription,
      },
      {
        title: "My Notes",
        url: "/s/notes",
        icon: IconFileText,
      },
      {
        title: "My Grades",
        url: "/s/grades",
        icon: IconFileCertificate,
        comingSoon: true,
      },
      {
        title: "My Timetable",
        url: "/s/timetables",
        icon: IconClock,
      },
    ],
  },
  {
    title: "Communication",
    url: "#",
    icon: IconMessage,
    items: [
      {
        title: "Messages",
        url: "/messages",
        icon: IconMessage,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "Settings",
        url: "/s/settings",
        icon: IconSettings,
      },
    ],
  },
];

export const parentNavLinks = [
  {
    title: "Main",
    url: "#",
    icon: IconLayout,
    items: [
      {
        title: "Dashboard",
        url: "/p/dashboard",
        icon: IconLayout,
      },
    ],
  },
  {
    title: "Academic",
    url: "#",
    icon: IconFileDescription,
    isActive: true,
    items: [
      {
        title: "Children's Progress",
        url: "/p/children",
        icon: IconFileDescription,
      },
    ],
  },
  {
    title: "Finance",
    url: "#",
    icon: IconCreditCard,
    items: [
      {
        title: "Fees & Payments",
        url: "/p/fees",
        icon: IconCreditCard,
        comingSoon: true,
      },
    ],
  },
  {
    title: "Communication",
    url: "#",
    icon: IconMessage,
    items: [
      {
        title: "Messages",
        url: "/messages",
        icon: IconMessage,
        comingSoon: true,
      },
    ],
  },
  {
    title: "System",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "Settings",
        url: "/p/settings",
        icon: IconSettings,
        comingSoon: true,
      },
    ],
  },
];

export const roleNavMap: Record<string, any[]> = {
  ADMINISTRATOR: adminNavLinks,
  TEACHER: teacherNavLinks,
  IT_SUPPORT: ITSupportNavLinks,
  DATA_ANALYST: dataAnalystNavLinks,
  EXAM_OFFICER: dataAnalystNavLinks,
  LIBRARIAN: librarianNavLinks,
  BURSAR: bursarNavLinks,
  STUDENT: studentNavLinks,
  PARENT: parentNavLinks,
};
