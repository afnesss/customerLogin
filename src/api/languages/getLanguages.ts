import axios from "axios";
import { api } from "../clientConfig";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../hooks/useToken";

export type Language = {
  language_id: string;
  state: number;
  last_change: string;
};
export const getLanguages = async () => {
  try {
    const res = await api.get("/languages");
    return res.data.data.languages as Language[];
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? (error.response?.data?.error?.title ?? "Get languages failed")
      : "Get languages failed";
    toast.error(message);
  }
};

export const LANGUAGES_KEY = ["languages"] as const;

export const useLanguagesData = () =>
  useQuery({
    queryKey: LANGUAGES_KEY,
    queryFn: getLanguages,
    enabled: Boolean(getToken()),
  });
