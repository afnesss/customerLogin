import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: `/api`,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("carecloud_token");
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept-Language"] = "cs, en-gb;q=0.8";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
