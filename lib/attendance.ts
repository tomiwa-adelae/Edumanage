import api from "./api";

export const attendanceService = {
  getByClassAndDate: async (
    schoolId: string,
    classId: string,
    date: string
  ) => {
    const res = await api.get(
      `/attendances/class/${schoolId}/${classId}?date=${date}`
    );
    return res.data;
  },
};
