import axios from "axios";
import URL from "../../API_URL";

const API = URL;

const api = axios.create({
  baseURL: API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout de 10 secondes
});

// Ajouter des logs pour le débogage
api.interceptors.request.use((request) => {
  console.log("Starting Request", {
    url: request.url,
    method: request.method,
    data: request.data,
  });
  return request;
});

// Ajouter multipart/form-data uniquement pour les requêtes qui en ont besoin
export const depensesApi = {
  getAllDepenses: () => api.get("/depenses/"),

  createDepense: (formData) =>
    api.post("/depenses/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    }),

  updateDepense: (id, formData) =>
    api.put(`/depenses/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteDepense: (id) => 
    api.delete(`/depenses/${id}/`, {
      headers: {
        Accept: 'application/json',
      },
    }).then(response => {
      if (response.status === 204) {
        return { success: true };
      }
      return response;
    }),

  getDepense: (id) => api.get(`/depenses/${id}/`),
};

// Intercepteur pour logger les erreurs
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      response: error.response,
      request: error.request,
    });
    return Promise.reject(error);
  }
);

export default api;
