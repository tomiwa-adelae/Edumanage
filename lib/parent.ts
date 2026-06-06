import api from "./api";

export const parentService = {
  getMyChildren: async (parentId: string, schoolId: string) => {
    const res = await api.get(`/parents/${schoolId}/children/${parentId}`);
    return res.data;
  },

  getChildDetails: async (
    parentId: string,
    childId: string,
    schoolId: string
  ) => {
    const res = await api.get(
      `/parents/${schoolId}/children/${parentId}/${childId}`
    );
    return res.data;
  },

  getChildAssignments: async (
    parentId: string,
    childId: string,
    schoolId: string
  ) => {
    const res = await api.get(
      `/parents/${schoolId}/children/${parentId}/${childId}/assignments`
    );
    return res.data;
  },

  getChildAttendances: async (
    parentId: string,
    childId: string,
    schoolId: string
  ) => {
    const res = await api.get(
      `/parents/${schoolId}/children/${parentId}/${childId}/attendances`
    );
    return res.data;
  },
};
