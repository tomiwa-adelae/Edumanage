import { Metadata } from "next";
import { env } from "./env";

// Base configuration
const BASE_URL = env.NEXT_PUBLIC_FRONTEND_URL || "https://projectstar.edu";
const SITE_NAME = "Edumanage";
const SITE_TAGLINE = "School Management System";

// Helper function to create metadata
export function createMetadata({
  title,
  description,
  keywords,
  path = "",
  image = "/og-image.png",
}: {
  title: string;
  description: string;
  keywords: string[];
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} - ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Authentication Pages
export const authMetadata = {
  login: createMetadata({
    title: "Login",
    description:
      "Access your school management dashboard. Secure login for administrators, teachers, students, and parents.",
    keywords: [
      "school login",
      "education portal",
      "student portal",
      "teacher login",
      "school management system",
    ],
    path: "/",
  }),
  register: createMetadata({
    title: "Create Account",
    description:
      "Register for Project Star school management system. Get started with your educational journey today.",
    keywords: [
      "school registration",
      "student signup",
      "teacher registration",
      "education portal signup",
    ],
    path: "/register",
  }),
  forgotPassword: createMetadata({
    title: "Reset Password",
    description:
      "Forgot your password? Securely reset your Project Star account password in a few simple steps.",
    keywords: [
      "password recovery",
      "forgot password",
      "reset school account",
      "account recovery",
    ],
    path: "/forgot-password",
  }),
  verifyCode: createMetadata({
    title: "Verify Security Code",
    description:
      "Enter the verification code sent to your email to secure your account access.",
    keywords: [
      "two-factor authentication",
      "2FA",
      "security code",
      "account verification",
    ],
    path: "/verify-code",
  }),
  newPassword: createMetadata({
    title: "Set New Password",
    description: "Create a new secure password for your Project Star account.",
    keywords: [
      "change password",
      "new password",
      "password reset",
      "secure account",
    ],
    path: "/new-password",
  }),
  passwordSuccess: createMetadata({
    title: "Password Reset Successful",
    description:
      "Your password has been successfully reset. You can now log in with your new credentials.",
    keywords: ["password changed", "reset successful", "account secured"],
    path: "/new-password/success",
  }),
};

// Onboarding Pages
export const onboardingMetadata = {
  staff: createMetadata({
    title: "Staff Onboarding - Complete Your Profile",
    description:
      "Welcome to Project Star! Complete your staff profile to access your dashboard and school resources.",
    keywords: [
      "staff onboarding",
      "teacher setup",
      "staff registration",
      "employee profile",
    ],
    path: "/onboarding/staff",
  }),
  student: createMetadata({
    title: "Student Application",
    description:
      "Complete your student application form to enroll in our school management system.",
    keywords: [
      "student enrollment",
      "school application",
      "student admission",
      "new student registration",
    ],
    path: "/onboarding/student",
  }),
};

// Admin Pages
export const adminMetadata = {
  dashboard: createMetadata({
    title: "Admin Dashboard",
    description:
      "Comprehensive school management overview. Monitor students, staff, classes, and key metrics at a glance.",
    keywords: [
      "admin dashboard",
      "school administration",
      "management overview",
      "school metrics",
    ],
    path: "/a/dashboard",
  }),
  students: createMetadata({
    title: "Student Management - All Students",
    description:
      "View and manage all enrolled students. Search, filter, and access student records efficiently.",
    keywords: [
      "student management",
      "student list",
      "student records",
      "enrollment management",
    ],
    path: "/a/students",
  }),
  studentsNew: createMetadata({
    title: "Add New Student - Student Registration",
    description:
      "Register a new student to your school. Enter student details and admission information.",
    keywords: [
      "add student",
      "student registration",
      "new enrollment",
      "student admission",
    ],
    path: "/a/students/new",
  }),
  studentsApproval: createMetadata({
    title: "Student Approvals - Pending Applications",
    description:
      "Review and approve pending student applications. Manage the admission process efficiently.",
    keywords: [
      "student approval",
      "admission review",
      "pending applications",
      "enrollment approval",
    ],
    path: "/a/students/approval",
  }),
  teachers: createMetadata({
    title: "Teacher Management - All Teachers",
    description:
      "Manage your teaching staff. View teacher profiles, subjects, and class assignments.",
    keywords: [
      "teacher management",
      "staff directory",
      "teaching staff",
      "teacher list",
    ],
    path: "/a/teachers",
  }),
  teachersNew: createMetadata({
    title: "Add New Teacher - Staff Registration",
    description:
      "Register a new teacher to your school. Enter teacher credentials and subject assignments.",
    keywords: [
      "add teacher",
      "teacher registration",
      "new staff",
      "hire teacher",
    ],
    path: "/a/teachers/new",
  }),
  staffs: createMetadata({
    title: "Staff Management - All Staff Members",
    description:
      "Manage all school staff members. View roles, departments, and staff information.",
    keywords: [
      "staff management",
      "employee directory",
      "school staff",
      "personnel management",
    ],
    path: "/a/staffs",
  }),
  staffsNew: createMetadata({
    title: "Add New Staff Member",
    description:
      "Register a new staff member to your school. Enter employee details and role assignment.",
    keywords: ["add staff", "staff registration", "new employee", "hire staff"],
    path: "/a/staffs/new",
  }),
  classes: createMetadata({
    title: "Class Management - All Classes",
    description:
      "Manage school classes, sections, and grade levels. View class details and student enrollment.",
    keywords: [
      "class management",
      "school classes",
      "grade levels",
      "classroom administration",
    ],
    path: "/a/classes",
  }),
  classesNew: createMetadata({
    title: "Create New Class",
    description:
      "Create a new class or section. Define grade level, capacity, and class details.",
    keywords: ["create class", "new class", "add section", "classroom setup"],
    path: "/a/classes/new",
  }),
  subjects: createMetadata({
    title: "Subject Management - All Subjects",
    description:
      "Manage academic subjects, curriculum, and course offerings across all grade levels.",
    keywords: [
      "subject management",
      "curriculum",
      "course management",
      "academic subjects",
    ],
    path: "/a/subjects",
  }),
  subjectsNew: createMetadata({
    title: "Add New Subject",
    description:
      "Create a new academic subject. Define subject name, code, and curriculum details.",
    keywords: [
      "add subject",
      "new course",
      "create subject",
      "curriculum planning",
    ],
    path: "/a/subjects/new",
  }),
  assessment: createMetadata({
    title: "Assessment Configuration",
    description:
      "Configure assessment types, grading schemes, and evaluation criteria for your school.",
    keywords: [
      "assessment configuration",
      "grading system",
      "evaluation setup",
      "marking scheme",
    ],
    path: "/a/assessment",
  }),
  roles: createMetadata({
    title: "Role Management - Permissions & Access",
    description:
      "Manage user roles, permissions, and access control across the school management system.",
    keywords: [
      "role management",
      "permissions",
      "access control",
      "user roles",
      "authorization",
    ],
    path: "/a/roles",
  }),
  fees: createMetadata({
    title: "Fee Management - Fee Structure",
    description:
      "Configure school fees, payment structures, and financial policies for students.",
    keywords: [
      "fee management",
      "tuition fees",
      "payment structure",
      "school fees",
      "financial management",
    ],
    path: "/a/fees",
  }),
  reports: createMetadata({
    title: "Reports & Analytics",
    description:
      "Generate comprehensive reports on students, attendance, academics, and school performance.",
    keywords: [
      "school reports",
      "analytics",
      "performance metrics",
      "data analysis",
      "reporting",
    ],
    path: "/a/reports",
  }),
  school: createMetadata({
    title: "School Settings - Configuration",
    description:
      "Configure school profile, academic policies, and institutional information.",
    keywords: [
      "school settings",
      "school configuration",
      "institution profile",
      "school information",
    ],
    path: "/a/school",
  }),
  schoolCalendar: createMetadata({
    title: "Academic Calendar - School Events",
    description:
      "Manage academic calendar, terms, holidays, and important school events.",
    keywords: [
      "academic calendar",
      "school calendar",
      "term dates",
      "holidays",
      "school events",
    ],
    path: "/a/school/calendar",
  }),
  timetables: createMetadata({
    title: "Timetable Management - Class Schedules",
    description:
      "Create and manage class timetables, subject schedules, and teaching periods.",
    keywords: [
      "timetable management",
      "class schedule",
      "time table",
      "lesson planning",
      "period allocation",
    ],
    path: "/a/timetables",
  }),
  import: createMetadata({
    title: "Data Import - Bulk Upload",
    description:
      "Import student, staff, and academic data in bulk. Upload CSV or Excel files.",
    keywords: [
      "data import",
      "bulk upload",
      "CSV import",
      "mass data entry",
      "batch upload",
    ],
    path: "/a/import",
  }),
  settings: createMetadata({
    title: "Admin Settings - Preferences",
    description:
      "Configure your personal admin preferences and dashboard settings.",
    keywords: [
      "admin settings",
      "preferences",
      "configuration",
      "account settings",
    ],
    path: "/a/settings",
  }),
};

// Teacher Pages
export const teacherMetadata = {
  dashboard: createMetadata({
    title: "Teacher Dashboard",
    description:
      "Your teaching overview. View classes, assignments, attendance, and student performance.",
    keywords: [
      "teacher dashboard",
      "teaching portal",
      "class overview",
      "teacher workspace",
    ],
    path: "/t/dashboard",
  }),
  assignments: createMetadata({
    title: "My Assignments - Teacher Portal",
    description:
      "Manage all your assignments. Create, view, and grade student submissions.",
    keywords: [
      "teacher assignments",
      "homework management",
      "assignment tracking",
      "student work",
    ],
    path: "/t/assignments",
  }),
  assignmentsNew: createMetadata({
    title: "Create Assignment",
    description:
      "Create a new assignment for your students. Set deadlines, instructions, and grading criteria.",
    keywords: [
      "create assignment",
      "new homework",
      "assignment creation",
      "set homework",
    ],
    path: "/t/assignments/new",
  }),
  attendances: createMetadata({
    title: "Attendance Management - Teacher",
    description:
      "Mark and manage student attendance for your classes. Track attendance patterns.",
    keywords: [
      "attendance management",
      "mark attendance",
      "student attendance",
      "attendance tracking",
    ],
    path: "/t/attendances",
  }),
  timetables: createMetadata({
    title: "My Timetable - Teaching Schedule",
    description:
      "View your teaching schedule, class periods, and lesson timetable.",
    keywords: [
      "teacher timetable",
      "teaching schedule",
      "lesson periods",
      "class schedule",
    ],
    path: "/t/timetables",
  }),
  settings: createMetadata({
    title: "Teacher Settings - Preferences",
    description:
      "Configure your personal teaching preferences and notification settings.",
    keywords: [
      "teacher settings",
      "preferences",
      "account settings",
      "notification preferences",
    ],
    path: "/t/settings",
  }),
};

// Student Pages
export const studentMetadata = {
  dashboard: createMetadata({
    title: "Student Dashboard",
    description:
      "Your learning hub. View assignments, grades, timetable, and class announcements.",
    keywords: [
      "student dashboard",
      "student portal",
      "learning hub",
      "my classes",
    ],
    path: "/s/dashboard",
  }),
  assignments: createMetadata({
    title: "My Assignments - Student Portal",
    description:
      "View and submit your assignments. Track deadlines and submission status.",
    keywords: [
      "student assignments",
      "homework",
      "assignment submissions",
      "pending work",
    ],
    path: "/s/assignments",
  }),
  grades: createMetadata({
    title: "My Grades - Academic Performance",
    description:
      "View your grades, scores, and academic performance across all subjects.",
    keywords: [
      "student grades",
      "academic results",
      "report card",
      "scores",
      "performance",
    ],
    path: "/s/grades",
  }),
  notes: createMetadata({
    title: "Class Notes - Learning Materials",
    description:
      "Access class notes, study materials, and resources shared by your teachers.",
    keywords: [
      "class notes",
      "study materials",
      "learning resources",
      "lecture notes",
      "course materials",
    ],
    path: "/s/notes",
  }),
  timetables: createMetadata({
    title: "My Timetable - Class Schedule",
    description:
      "View your class schedule, lesson times, and subject timetable.",
    keywords: [
      "student timetable",
      "class schedule",
      "lesson times",
      "school schedule",
    ],
    path: "/s/timetables",
  }),
  settings: createMetadata({
    title: "Student Settings - Preferences",
    description: "Configure your personal preferences and account settings.",
    keywords: [
      "student settings",
      "account preferences",
      "notification settings",
      "profile settings",
    ],
    path: "/s/settings",
  }),
};

// Parent Pages
export const parentMetadata = {
  dashboard: createMetadata({
    title: "Parent Dashboard",
    description:
      "Monitor your children's academic progress, attendance, and school activities.",
    keywords: [
      "parent dashboard",
      "parent portal",
      "child monitoring",
      "academic oversight",
    ],
    path: "/p/dashboard",
  }),
  children: createMetadata({
    title: "My Children - Parent Portal",
    description:
      "View profiles and academic information for all your registered children.",
    keywords: [
      "children list",
      "ward information",
      "child profiles",
      "parent access",
    ],
    path: "/p/children",
  }),
};

// Other Staff Dashboards
export const staffMetadata = {
  bursar: createMetadata({
    title: "Bursar Dashboard - Financial Management",
    description:
      "Manage school finances, fee collection, and financial reports.",
    keywords: [
      "bursar dashboard",
      "financial management",
      "fee collection",
      "school finance",
    ],
    path: "/b/dashboard",
  }),
  dataAnalyst: createMetadata({
    title: "Data Analyst Dashboard - School Analytics",
    description:
      "Access comprehensive data analytics, reports, and performance insights.",
    keywords: [
      "data analytics",
      "school reports",
      "data analysis",
      "performance metrics",
    ],
    path: "/da/dashboard",
  }),
  examOfficer: createMetadata({
    title: "Exam Officer Dashboard - Examination Management",
    description: "Manage examinations, assessments, and academic evaluations.",
    keywords: [
      "exam officer",
      "examination management",
      "test administration",
      "academic assessment",
    ],
    path: "/eo/dashboard",
  }),
  itSupport: createMetadata({
    title: "IT Support Dashboard - Technical Support",
    description:
      "Manage technical support tickets, system maintenance, and IT resources.",
    keywords: [
      "IT support",
      "technical support",
      "system administration",
      "help desk",
    ],
    path: "/it/dashboard",
  }),
  librarian: createMetadata({
    title: "Librarian Dashboard - Library Management",
    description:
      "Manage library resources, book inventory, and student borrowing.",
    keywords: [
      "librarian dashboard",
      "library management",
      "book inventory",
      "library system",
    ],
    path: "/l/dashboard",
  }),
};

// Shared Pages
export const sharedMetadata = {
  messages: createMetadata({
    title: "Messages - Internal Communication",
    description:
      "Send and receive messages with teachers, students, and staff members.",
    keywords: [
      "messages",
      "school communication",
      "internal messaging",
      "chat",
      "notifications",
    ],
    path: "/messages",
  }),
  profile: createMetadata({
    title: "My Profile",
    description:
      "View and manage your personal profile and account information.",
    keywords: [
      "user profile",
      "my account",
      "personal information",
      "profile settings",
    ],
    path: "/profile",
  }),
};

// Dynamic metadata generators for pages with parameters
export function generateStudentProfileMetadata(username: string) {
  return createMetadata({
    title: `Student Profile - ${username}`,
    description: `View detailed student information, academic records, attendance, and performance metrics for ${username}.`,
    keywords: [
      "student profile",
      "student details",
      "academic records",
      "student information",
    ],
    path: `/a/students/${username}`,
  });
}

export function generateStudentEditMetadata(username: string) {
  return createMetadata({
    title: `Edit Student Profile - ${username}`,
    description: `Update student information, contact details, and enrollment status for ${username}.`,
    keywords: [
      "edit student",
      "update student",
      "student information",
      "modify records",
    ],
    path: `/a/students/${username}/edit`,
  });
}

export function generateStudentApprovalMetadata(username: string) {
  return createMetadata({
    title: `Review Student Application - ${username}`,
    description: `Review student application details and approve or reject enrollment request for ${username}.`,
    keywords: [
      "application review",
      "admission approval",
      "student verification",
      "enrollment decision",
    ],
    path: `/a/students/approval/${username}`,
  });
}

export function generateStaffProfileMetadata(username: string) {
  return createMetadata({
    title: `Staff Profile - ${username}`,
    description: `View detailed staff member information, role, department, and contact details for ${username}.`,
    keywords: [
      "staff profile",
      "employee details",
      "staff information",
      "personnel record",
    ],
    path: `/a/staffs/${username}`,
  });
}

export function generateStaffEditMetadata(username: string) {
  return createMetadata({
    title: `Edit Staff Profile - ${username}`,
    description: `Update staff member information, role assignment, and contact details for ${username}.`,
    keywords: [
      "edit staff",
      "update employee",
      "staff information",
      "modify personnel",
    ],
    path: `/a/staffs/${username}/edit`,
  });
}

export function generateClassDetailsMetadata(classId: string) {
  return createMetadata({
    title: `Class Details - ${classId}`,
    description:
      "View class information, enrolled students, assigned teachers, and subject details.",
    keywords: [
      "class details",
      "class information",
      "student roster",
      "class profile",
    ],
    path: `/a/classes/${classId}`,
  });
}

export function generateAssignmentDetailsMetadata(slug: string) {
  return createMetadata({
    title: `Assignment Details - ${slug}`,
    description:
      "View assignment details, student submissions, and grading progress.",
    keywords: [
      "assignment details",
      "homework overview",
      "submission tracking",
      "assignment management",
    ],
    path: `/t/assignments/${slug}`,
  });
}

export function generateGradeSubmissionMetadata(slug: string, id: string) {
  return createMetadata({
    title: `Grade Submission - ${slug}`,
    description:
      "Grade student assignment submission. Provide feedback and assign scores.",
    keywords: [
      "grade assignment",
      "mark homework",
      "assignment grading",
      "student feedback",
    ],
    path: `/t/assignments/${slug}/${id}`,
  });
}

export function generateTeacherStudentProfileMetadata(username: string) {
  return createMetadata({
    title: `Student Profile - ${username}`,
    description: `View student profile, academic performance, and attendance records for ${username}.`,
    keywords: [
      "student profile",
      "student details",
      "academic record",
      "student performance",
    ],
    path: `/t/students/${username}`,
  });
}

export function generateStudentAssignmentMetadata(slug: string) {
  return createMetadata({
    title: `Submit Assignment - ${slug}`,
    description:
      "View assignment details and submit your work. Upload files and track submission status.",
    keywords: [
      "assignment submission",
      "submit homework",
      "upload assignment",
      "complete work",
    ],
    path: `/s/assignments/${slug}`,
  });
}

export function generateStudentNoteMetadata(slug: string) {
  return createMetadata({
    title: `View Note - ${slug}`,
    description:
      "Read class notes and learning materials. Download resources for offline study.",
    keywords: [
      "class note",
      "study material",
      "lesson content",
      "learning resource",
    ],
    path: `/s/notes/${slug}`,
  });
}

export function generateUserProfileMetadata(username: string) {
  return createMetadata({
    title: `User Profile - ${username}`,
    description: `View user profile information, role, and contact details for ${username}.`,
    keywords: [
      "profile view",
      "user information",
      "account details",
      "profile page",
    ],
    path: `/profile/${username}`,
  });
}

export function generateEditUserProfileMetadata(username: string) {
  return createMetadata({
    title: `Edit Profile - ${username}`,
    description:
      "Update your personal information, contact details, and profile picture.",
    keywords: [
      "edit profile",
      "update information",
      "change details",
      "profile settings",
    ],
    path: `/profile/${username}/edit`,
  });
}
