import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const getDeployments = () => api.get("/deployments");
export const getLogs = () => api.get("/logs");
export const getHealthMetrics = () => api.get("/health");

export const createDeployment = (data) => api.post("/deployments", data);
export const createLog = (data) => api.post("/logs", data);
export const createHealthMetric = (data) => api.post("/health", data);

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.get("/auth/logout");
export const getMe = () => api.get("/auth/get-me");

export default api;
