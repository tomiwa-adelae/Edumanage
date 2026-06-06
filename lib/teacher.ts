import api from "./api";
import { PaginationParams } from "./types/pagination";

export const teacherService = {
  getTeacherClasses: async (schoolId: string, teacherId: string) => {
    const res = await api.get(`/teachers/${teacherId}/${schoolId}/classes`);
    return res.data;
  },

  getTeacherSubjects: async (schoolId: string, teacherId: string) => {
    const res = await api.get(`/teachers/${teacherId}/${schoolId}/subjects`);
    return res.data;
  },

  getTeacherStudents: async (
    schoolId: string,
    teacherId: string,
    params?: PaginationParams
  ) => {
    const res = await api.get(`/teachers/${teacherId}/${schoolId}/students`, {
      params,
    });
    return res.data;
  },

  getTeacherStudentDetails: async (
    schoolId: string,
    teacherId: string,
    username: string | string[]
  ) => {
    const res = await api.get(
      `/teachers/${teacherId}/${schoolId}/students/${username}`
    );
    return res.data;
  },

  getStudentInClass: async (
    schoolId: string,
    teacherId: string,
    classId: string
  ) => {
    const res = await api.get(
      `/teachers/${teacherId}/${schoolId}/${classId}/students`
    );
    return res.data;
  },

  getTeacherAssignmentsDocuments: async (
    schoolId: string,
    teacherId: string
  ) => {
    const res = await api.get(
      `/assignments/${teacherId}/${schoolId}/all-assignment-documents`
    );
    return res.data;
  },

  getTeacherAssignments: async (schoolId: string, teacherId: string) => {
    const res = await api.get(
      `/assignments/${teacherId}/${schoolId}/assignments`
    );
    return res.data;
  },

  getTeacherLessonNotes: async (schoolId: string, teacherId: string) => {
    const res = await api.get(
      `/assignments/${teacherId}/${schoolId}/lesson-notes`
    );
    return res.data;
  },

  getTeacherAssignmentsDetails: async (
    schoolId: string,
    teacherId: string,
    assignmentId: string | string[]
  ) => {
    const res = await api.get(
      `/assignments/teachers/${teacherId}/${schoolId}/assignments/${assignmentId}`
    );
    return res.data;
  },

  getStudentAssignmentsDetails: async (
    schoolId: string,
    assignmentId: string | string[]
  ) => {
    const res = await api.get(
      `/assignment-submissions/${schoolId}/${assignmentId}`
    );
    return res.data;
  },

  getTeacherStudentAssignments: async (
    schoolId: string,
    teacherId: string,
    username: string | string[]
  ) => {
    const res = await api.get(
      `/teachers/${teacherId}/${schoolId}/students/${username}/assignments`
    );
    return res.data;
  },
};
