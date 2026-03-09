import axios from "axios";

// Vite: можна задати у .env: VITE_API_URL=http://127.0.0.1:8000
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("access_token");
    }
    return Promise.reject(err);
  }
);

export default api;
