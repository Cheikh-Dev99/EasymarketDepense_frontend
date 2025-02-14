import axios from "axios";

const API_URL = "https://easymarketdepense-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

export const depensesApi = {
  getAllDepenses: () => api.get("/depenses/"),

  createDepense: (formData) => api.post("/depenses/", formData),

  updateDepense: (id, formData) =>
    api.put(`/depenses/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }),

  deleteDepense: (id) => api.delete(`/depenses/${id}/`),

  getDepense: (id) => api.get(`/depenses/${id}/`),
};

// Intercepteur pour logger les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

export default api;
