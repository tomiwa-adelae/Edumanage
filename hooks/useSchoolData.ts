import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService } from "@/lib/school";
import { PaginationParams } from "@/lib/types/pagination";
import { toast } from "sonner";

// Query Keys - centralized for easy cache management
export const schoolKeys = {
  all: ["schools"] as const,
  school: (schoolId: string) => [...schoolKeys.all, schoolId] as const,
  staffs: (schoolId: string, params?: PaginationParams) =>
    [...schoolKeys.school(schoolId), "staffs", params] as const,
  staff: (schoolId: string, staffId: string) =>
    [...schoolKeys.school(schoolId), "staff", staffId] as const,
  teachers: (schoolId: string, params?: PaginationParams) =>
    [...schoolKeys.school(schoolId), "teachers", params] as const,
  students: (schoolId: string, params?: PaginationParams) =>
    [...schoolKeys.school(schoolId), "students", params] as const,
  parents: (schoolId: string, params?: PaginationParams) =>
    [...schoolKeys.school(schoolId), "parents", params] as const,
  users: (schoolId: string, params?: PaginationParams) =>
    [...schoolKeys.school(schoolId), "users", params] as const,
  admins: (schoolId: string) =>
    [...schoolKeys.school(schoolId), "admins"] as const,
  classes: (schoolId: string) =>
    [...schoolKeys.school(schoolId), "classes"] as const,
  classDetail: (schoolId: string, classId: string) =>
    [...schoolKeys.school(schoolId), "class", classId] as const,
  subjects: (schoolId: string) =>
    [...schoolKeys.school(schoolId), "subjects"] as const,
  teacherAssignments: (schoolId: string) =>
    [...schoolKeys.school(schoolId), "teacher-assignments"] as const,
  pendingStudents: (schoolId: string) =>
    [...schoolKeys.school(schoolId), "students", "pending"] as const,
  rejectedStudents: (schoolId: string) =>
    [...schoolKeys.school(schoolId), "students", "rejected"] as const,
  studentDocuments: (schoolId: string, studentId: string) =>
    [...schoolKeys.school(schoolId), "student", studentId, "documents"] as const,
  studentTimelines: (schoolId: string, studentId: string) =>
    [...schoolKeys.school(schoolId), "student", studentId, "timelines"] as const,
  pendingStudentDetails: (schoolId: string, username: string) =>
    [...schoolKeys.school(schoolId), "student", "pending", username] as const,
};

// ==================== QUERY HOOKS ====================

/**
 * Get school details
 * @param schoolId School ID
 * @param options Query options
 */
export function useSchool(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.school(schoolId!),
    queryFn: () => schoolService.getSchool(schoolId!),
    enabled: !!schoolId,
    staleTime: 10 * 60 * 1000, // School data changes rarely, cache for 10 mins
  });
}

/**
 * Get school staffs with pagination
 * @param schoolId School ID
 * @param params Pagination parameters
 */
export function useSchoolStaffs(
  schoolId: string | undefined,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: schoolKeys.staffs(schoolId!, params),
    queryFn: () => schoolService.getSchoolStaffs(schoolId!, params),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000, // Fresh for 2 minutes
  });
}

/**
 * Get single staff member
 * @param schoolId School ID
 * @param staffId Staff ID
 */
export function useSchoolStaff(
  schoolId: string | undefined,
  staffId: string | undefined
) {
  return useQuery({
    queryKey: schoolKeys.staff(schoolId!, staffId!),
    queryFn: () => schoolService.getSchoolStaff(schoolId!, staffId!),
    enabled: !!schoolId && !!staffId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get school teachers with pagination
 * @param schoolId School ID
 * @param params Pagination parameters
 */
export function useSchoolTeachers(
  schoolId: string | undefined,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: schoolKeys.teachers(schoolId!, params),
    queryFn: () => schoolService.getSchoolTeachers(schoolId!, params),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get school parents with pagination
 * @param schoolId School ID
 * @param params Pagination parameters
 */
export function useSchoolParents(
  schoolId: string | undefined,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: schoolKeys.parents(schoolId!, params),
    queryFn: () => schoolService.getSchoolParents(schoolId!, params),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get school users with pagination
 * @param schoolId School ID
 * @param params Pagination parameters
 */
export function useSchoolUsers(
  schoolId: string | undefined,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: schoolKeys.users(schoolId!, params),
    queryFn: () => schoolService.getSchoolUsers(schoolId!, params),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get school admins
 * @param schoolId School ID
 */
export function useSchoolAdmins(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.admins(schoolId!),
    queryFn: () => schoolService.getSchoolAdmins(schoolId!),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // Admins don't change often
  });
}

/**
 * Get school students with pagination
 * @param schoolId School ID
 * @param params Pagination parameters
 */
export function useSchoolStudents(
  schoolId: string | undefined,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: schoolKeys.students(schoolId!, params),
    queryFn: () => schoolService.getStudents(schoolId!, params),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get school classes
 * @param schoolId School ID
 */
export function useSchoolClasses(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.classes(schoolId!),
    queryFn: () => schoolService.getSchoolClasses(schoolId!),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // Classes change rarely
  });
}

/**
 * Get class details
 * @param schoolId School ID
 * @param classId Class ID
 */
export function useSchoolClassDetails(
  schoolId: string | undefined,
  classId: string | undefined
) {
  return useQuery({
    queryKey: schoolKeys.classDetail(schoolId!, classId!),
    queryFn: () => schoolService.getSchoolClassDetails(schoolId!, classId!),
    enabled: !!schoolId && !!classId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get school subjects
 * @param schoolId School ID
 */
export function useSchoolSubjects(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.subjects(schoolId!),
    queryFn: () => schoolService.getSchoolSubjects(schoolId!),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get teacher assignments
 * @param schoolId School ID
 */
export function useTeacherAssignments(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.teacherAssignments(schoolId!),
    queryFn: () => schoolService.getTeacherAssignments(schoolId!),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get pending students approval
 * @param schoolId School ID
 */
export function usePendingStudents(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.pendingStudents(schoolId!),
    queryFn: () => schoolService.getStudentsPendingApproval(schoolId!),
    enabled: !!schoolId,
    staleTime: 1 * 60 * 1000, // Refresh more frequently for approvals
  });
}

/**
 * Get rejected students
 * @param schoolId School ID
 */
export function useRejectedStudents(schoolId: string | undefined) {
  return useQuery({
    queryKey: schoolKeys.rejectedStudents(schoolId!),
    queryFn: () => schoolService.getRejectedStudentsApproval(schoolId!),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get student documents
 * @param schoolId School ID
 * @param studentId Student ID
 */
export function useStudentDocuments(
  schoolId: string | undefined,
  studentId: string | undefined
) {
  return useQuery({
    queryKey: schoolKeys.studentDocuments(schoolId!, studentId!),
    queryFn: () => schoolService.getStudentDocuments(studentId!, schoolId!),
    enabled: !!schoolId && !!studentId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Get student timelines
 * @param schoolId School ID
 * @param studentId Student ID
 */
export function useStudentTimelines(
  schoolId: string | undefined,
  studentId: string | undefined
) {
  return useQuery({
    queryKey: schoolKeys.studentTimelines(schoolId!, studentId!),
    queryFn: () => schoolService.getStudentTimelines(studentId!, schoolId!),
    enabled: !!schoolId && !!studentId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Get pending student details
 * @param schoolId School ID
 * @param username Username
 */
export function usePendingStudentDetails(
  schoolId: string | undefined,
  username: string | undefined
) {
  return useQuery({
    queryKey: schoolKeys.pendingStudentDetails(schoolId!, username!),
    queryFn: () => schoolService.getPendingStudentDetails(schoolId!, username!),
    enabled: !!schoolId && !!username,
    staleTime: 2 * 60 * 1000,
  });
}

// ==================== UTILITY HOOKS ====================

/**
 * Invalidate all school queries
 */
export function useInvalidateSchoolQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: schoolKeys.all }),
    invalidateSchool: (schoolId: string) =>
      queryClient.invalidateQueries({ queryKey: schoolKeys.school(schoolId) }),
    invalidateStaffs: (schoolId: string) =>
      queryClient.invalidateQueries({ queryKey: [...schoolKeys.school(schoolId), "staffs"] }),
    invalidateStudents: (schoolId: string) =>
      queryClient.invalidateQueries({ queryKey: [...schoolKeys.school(schoolId), "students"] }),
    invalidateTeachers: (schoolId: string) =>
      queryClient.invalidateQueries({ queryKey: [...schoolKeys.school(schoolId), "teachers"] }),
  };
}

/**
 * Prefetch school data
 */
export function usePrefetchSchoolData() {
  const queryClient = useQueryClient();

  return {
    prefetchStaffs: (schoolId: string, params?: PaginationParams) =>
      queryClient.prefetchQuery({
        queryKey: schoolKeys.staffs(schoolId, params),
        queryFn: () => schoolService.getSchoolStaffs(schoolId, params),
      }),
    prefetchStudents: (schoolId: string, params?: PaginationParams) =>
      queryClient.prefetchQuery({
        queryKey: schoolKeys.students(schoolId, params),
        queryFn: () => schoolService.getStudents(schoolId, params),
      }),
    prefetchTeachers: (schoolId: string, params?: PaginationParams) =>
      queryClient.prefetchQuery({
        queryKey: schoolKeys.teachers(schoolId, params),
        queryFn: () => schoolService.getSchoolTeachers(schoolId, params),
      }),
  };
}
