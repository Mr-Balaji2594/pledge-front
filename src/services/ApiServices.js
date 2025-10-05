import { message } from "antd";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/"/g, "")}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 handling
      if (status === 401) {
        const token = localStorage.getItem("token");

        if (token) {
          // Token exists → session expired / invalid token
          message.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        } else {
          // No token → likely login attempt failed
          const msg =
            data?.message || "Invalid email or password. Please try again.";
          message.error(msg);
        }
      }

      // 403 handling
      if (status === 403) {
        message.warning("You do not have permission to access this page.");
        window.location.href = "/subscription";
      }

      // Optional: handle 500
      if (status === 500) {
        message.error("Server error. Please try again later.");
        console.error(error.response);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
