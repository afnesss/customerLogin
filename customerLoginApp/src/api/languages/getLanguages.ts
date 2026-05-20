import axios from "axios";
import { api } from "../clientConfig";
import { toast } from "sonner";

export const getLanguages = async () => {
  try {
    const res = await api.get("/languages");

    return res.data;
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? (error.response?.data?.error?.title ?? "Get languages failed")
      : "Get languages failed";
    toast.error(message);
  }
};
