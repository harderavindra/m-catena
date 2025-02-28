import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Fix: Do NOT redirect immediately, instead handle it in UI
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        console.warn("Unauthorized! Logging out...");
        localStorage.removeItem("token");

        // ❌ Do NOT use `window.location.href = "/login";`
        // ✅ Instead, return the error and handle it in UI
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
