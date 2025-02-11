import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8002",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error.response?.status === 403) {
      console.error("Accès refusé : vous n'avez pas les autorisations nécessaires.");
    } else if (error.response?.status === 500) {
      console.error("Erreur serveur interne : veuillez réessayer plus tard.");
    }
    return Promise.reject(error);
  }
);

export default api;
