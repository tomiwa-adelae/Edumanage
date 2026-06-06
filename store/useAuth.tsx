import { Subject } from "@/app/(app)/(admin)/a/subjects/page";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Teacher = {
  id?: string;
  user: User;
  classes: Class[];
  assignments: Assignment[];
};

export type Document = {
  id: string;
  name: string;
  remarks: string;
  reviewedAt: string;
  reviewedBy: string;
  status: string;
  type: string;
  createdAt: string;
  url: string;
  verified: boolean;
};

export type Class = {
  id: string;
  level: string;
  section: string | null;
  capacity: string | null;
  classRoomNumber: string | null;
  description: string | null;
  department: string | null;
  Teacher: Teacher | null;
  schoolId: string;
  createdAt: string | null;
  updatedAt: string | null;
  _count: {
    students: number;
  };
  students: Student[];
};

export type Assignment = {
  Class: Class;
  classId: true;
  createdAt: string;
  description: string;
  instructions: string;
  totalMarks: number;
  dueDate: string;
  id: string;
  subject: Subject;
  Subject: Subject;
  teacherId: string;
  Teacher: Teacher;
  type: string;
  title: string;
  slug: string;
  attachments: Attachment[];
  assignmentSubmissions: AssignmentSubmissions[];
};

export type School = {
  id: string;
  name: string;
  acronym: string | null;
  motto: string | null;
  visionStatement: string | null;
  missionStatement: string | null;
  establishmentYear: string | null;
  logo: string | null;
  schoolType: string | null;
  ownershipType: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  state: string | null;
  postalCode: string | null;
  primaryPhone: string | null;
  alternatePhone: string | null;
  email: string | null;
  website: string | null;
  currentSession: string | null;
  currentTerm: string | null;
  termsPerSession: string | null;
  academicStartDate: string | null;
  academicEndDate: string | null;
  gradingSystem: string | null;
  passMark: string | null;
  schoolRegistrationNumber: string | null;
  accreditationBody: string | null;
  accreditationNumber: string | null;
  schoolID: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
} | null;

export type Attendance = {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  markedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  Class: Class;
  LGA: string | null;
  candidateNumber: string;
  desiredClass: string | null;
  examScore: string;
  completedOnboarding: boolean;
  id: string;
  isApproved: boolean;
  isRejected: boolean;
  applicationStatus: string;
  previousSchool: string | null;
  rejectionReason: string | null;
  approvalDate: string | null;
  admissionNumber: string | null;
  ParentStudentLink: {
    parent: Parent;
    relation: string;
  }[];
  documents: Document[];
  user: User;
  assignmentSubmissions: AssignmentSubmissions[];
  Attendance?: Attendance[];
};
export type ParentChildrenLink = {
  relation: string;
  student: Student;
  id: string;
};

export type Parent = {
  user: User;
};

export type User = {
  id: string;
  email: string;
  title?: string;
  firstName: string;
  lastName: string;
  otherName: string;
  username: string;
  phoneNumber: string;
  image: string | null;
  occupation: string | null;
  employeeID: string | null;
  department: string | null;
  medicalConditions: string | null;
  dob: string | null;
  createdAt: string | null;
  city: string | null;
  address: string | null;
  state: string | null;
  country: string | null;
  emergencyContactName: string | null;
  emergencyPhoneNumber: string | null;
  role: string;
  gender: string | null;
  schoolId: string;
  school?: School | null;
  classes?: Class[] | null;
  Student: Student;
  Teacher: Teacher;
  schoolRoles: SchoolRoles[];
} | null;

export type SchoolRoles = {
  createdAt: Date;
  id: string;
  role: string;
  schoolId: string;
  updatedAt: string;
  userId: string;
};

export type Attachment = {
  id: string;
  assignmentId: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
};

export type AssignmentSubmissionAttachment = {
  id: string;
  submissionId: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
};

export type AssignmentSubmissions = {
  assignmentId: string;
  grade: string;
  comment: string;
  gradingComment: string;
  gradedById: string;
  gradedAt: string;
  gradedBy: { user: User };
  id: string;
  schoolId: string;
  submittedAt: string;
  status: string;
  attachments: AssignmentSubmissionAttachment[];
  Student: Student;
  studentId: string;
  Assignment: Assignment;
  Class: Class;
};

type AuthState = {
  user: User;
  setUser: (user: User) => void;
  currentRole: string | null;
  clearUser: () => void;
  setCurrentRole: (role: string) => void;
  updateSchool: (school: School) => void;
  updateStudent: (student: any) => void;
  _hasHydrated: boolean; // ✅ added
  setHasHydrated: (hasHydrated: boolean) => void; // ✅ added
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentRole: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setCurrentRole: (role) => {
        // persist in localStorage so refresh doesn’t lose it
        localStorage.setItem("currentRole", role);
        set({ currentRole: role });
      },
      updateStudent: (updates: Partial<Student>) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              Student: {
                ...state.user.Student,
                ...updates,
              },
            },
          };
        }),
      updateSchool: (school) =>
        set((state) => ({
          user: state.user ? { ...state.user, school } : null,
        })),
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth-user",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
