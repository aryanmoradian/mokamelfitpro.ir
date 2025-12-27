import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // ⏱️ 30 ثانیه
});

// اضافه کردن JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
