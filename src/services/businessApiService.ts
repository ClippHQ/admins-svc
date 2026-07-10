import axios, { AxiosInstance } from "axios";
import { getApplicationToken } from "src/lib/application-token";

// Separate from apiClient: the business-account wizard is an in-app webview
// authenticated via ?application_token=<jwt>, not the admin's localStorage session,
// so it must not carry the admin token or trigger the admin 401 -> /auth/login redirect.
const businessApiClient: AxiosInstance = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:8080",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

businessApiClient.interceptors.request.use((config) => {
  const token = getApplicationToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default businessApiClient;
