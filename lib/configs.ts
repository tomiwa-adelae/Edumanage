import api from "./api";

export const configService = {
  getAll: async () => {
    const res = await api.get("/config");
    return res.data;
  },

  getCategory: async (name: string) => {
    const res = await api.get(`/config/${name}`);
    return res.data;
  },
};
