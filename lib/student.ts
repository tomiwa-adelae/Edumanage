import api from "./api";

export const studentService = {
  getStudentAssignments: async (schoolId: string, studentId: string) => {
    const res = await api.get(
      `/assignments/students/${studentId}/${schoolId}/assignments`
    );
    return res.data;
  },

  getStudentAssignmentsDetails: async (
    schoolId: string,
    studentId: string,
    assignmentId: string | string[]
  ) => {
    const res = await api.get(
      `/assignments/students/${studentId}/${schoolId}/assignments/${assignmentId}`
    );
    return res.data;
  },

  getStudentNotes: async (schoolId: string, studentId: string) => {
    const res = await api.get(
      `/assignments/students/${studentId}/${schoolId}/lesson-notes`
    );
    return res.data;
  },

  getMyAttendances: async (studentId: string, schoolId: string) => {
    const res = await api.get(`/students/${studentId}/${schoolId}/attendances`);
    return res.data;
  },
};
