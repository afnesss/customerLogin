import axios from "axios";

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return value;
    }
  }

  return null;
}

export const api = axios.create({
  baseURL: `/api`,
});

api.interceptors.request.use((config) => {
  const token = getCookie("carecloud_token");
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept-Language"] = "cs, en-gb;q=0.8";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
