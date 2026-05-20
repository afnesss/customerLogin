import axios from "axios";
import { toast } from "sonner";
import { getToken, removeToken } from "../hooks/useToken";

export const api = axios.create({
  baseURL: `/api`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept-Language"] = "cs, en-gb;q=0.8";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data.message || "An error occurred";

      if (statusCode === 401) {
        removeToken();
        toast.error("Unauthorized access");
      } else if (statusCode === 403) {
        toast.error("Forbidden");
      } else if (statusCode === 404) {
        toast.error("Not found");
      } else if (statusCode === 500) {
        toast.error("Server error - try again later");
      } else {
        toast.error(`Error ${statusCode}: ${errorMessage}`);
      }
    } else if (error.request) {
      toast.error("Network error - check your internet connection");
    } else {
      toast.error("Request error:", error.message);
    }

    // Optionally, return a rejected promise to ensure `.catch` is triggered in individual requests
    return Promise.reject(error);
  },
);
