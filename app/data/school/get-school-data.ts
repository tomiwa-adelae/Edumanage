import api from "@/lib/api";

export const schoolData = {
  getSchoolData: async (name: string) => {
    const res = await api.get(`/schools/`);
    return res.data;
  },
};
