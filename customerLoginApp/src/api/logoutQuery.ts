import axios from "axios";
import Cookies from "js-cookie";
import { api } from "./clientConfig";
import { toast } from "sonner";

export const logoutQuery = async () => {
  try {
    const token = Cookies.get("carecloud_token");

    if (!token) {
      return null;
    }
    const response = await api.post(
      `/tokens/${token}/actions/logout`,
      {},
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    toast.success("Logged out successfully");
    return response.data;
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? (error.response?.data?.error?.title ?? "Logout failed. Please try again.")
      : "Logout failed. Please try again.";
    toast.error(message);
  }
};
