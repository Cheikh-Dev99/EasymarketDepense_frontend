import axios from "axios";

const API_URL = "http://192.168.1.2:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const depensesApi = {
  getAllDepenses: () => api.get("/depenses/"),

  createDepense: (formData) => api.post("/depenses/", formData),

  updateDepense: (id, formData) => api.put(`/depenses/${id}/`, formData),

  deleteDepense: (id) => api.delete(`/depenses/${id}/`),

  getDepense: (id) => api.get(`/depenses/${id}/`),
};

export default api;
