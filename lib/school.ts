import api from "./api";
import { PaginationParams } from "./types/pagination";

export const schoolService = {
  getSchool: async (schoolID: string) => {
    const res = await api.get(`/schools/${schoolID}`);
    return res.data;
  },

  getSchoolStaffs: async (schoolID: string, params?: PaginationParams) => {
    const res = await api.get(`/schools/${schoolID}/staffs`, { params });
    return res.data;
  },

  getSchoolUsers: async (schoolID: string, params?: PaginationParams) => {
    const res = await api.get(`/schools/${schoolID}/users`, { params });
    return res.data;
  },

  getSchoolStaff: async (schoolId: string, staffID: string | string[]) => {
    const res = await api.get(`/schools/${schoolId}/staffs/${staffID}`);
    return res.data;
  },

  getSchoolTeachers: async (id: string, params?: PaginationParams) => {
    const res = await api.get(`/schools/${id}/teachers`, { params });
    return res.data;
  },

  getSchoolParents: async (id: string, params?: PaginationParams) => {
    const res = await api.get(`/schools/${id}/parents`, { params });
    return res.data;
  },

  getSchoolAdmins: async (id: string) => {
    const res = await api.get(`/schools/${id}/admins`);
    return res.data;
  },

  getSchoolClasses: async (schoolID: string) => {
    const res = await api.get(`/classes/${schoolID}`);
    return res.data;
  },

  getSchoolSubjects: async (schoolID: string) => {
    const res = await api.get(`/subjects/${schoolID}`);
    return res.data;
  },

  getSchoolClassDetails: async (
    schoolID: string,
    classID: string | string[]
  ) => {
    const res = await api.get(`/classes/${schoolID}/${classID}`);
    return res.data;
  },

  getTeacherAssignments: async (schoolID: string) => {
    const res = await api.get(`/schools/${schoolID}/assign-teachers`);
    return res.data;
  },

  getUserSchema: async (modelName: string) => {
    const res = await api.get(`/schema/${modelName}`);
    return res.data;
  },

  getStudents: async (schoolId: string, params?: PaginationParams) => {
    const res = await api.get(`/students/${schoolId}`, { params });
    return res.data;
  },

  getStudentsPendingApproval: async (schoolId: string) => {
    const res = await api.get(`/students/${schoolId}/pending-approval`);
    return res.data;
  },

  getRejectedStudentsApproval: async (schoolId: string) => {
    const res = await api.get(`/students/${schoolId}/rejected-approval`);
    return res.data;
  },

  getStudentDocuments: async (id: string, schoolId: string) => {
    const res = await api.get(`/students/${id}/${schoolId}/documents`);
    return res.data;
  },

  getStudentTimelines: async (id: string, schoolId: string) => {
    const res = await api.get(`/students/${id}/${schoolId}/timeline`);
    return res.data;
  },

  getPendingStudentDetails: async (
    schoolId: string,
    username: string | string[]
  ) => {
    const res = await api.get(`/students/pending/${username}/${schoolId}`);
    return res.data;
  },

  getStudentDetails: async (schoolId: string, username: string | string[]) => {
    const res = await api.get(`/students/${username}/${schoolId}`);
    return res.data;
  },
};
