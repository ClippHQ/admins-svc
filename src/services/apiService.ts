import axios, { AxiosInstance, AxiosResponse } from "axios";

// ✅ Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:8080/",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor — adds Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — handle global errors or responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optionally handle logout or redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;