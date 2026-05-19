import Cookies from "js-cookie";
import { api } from "./clientConfig";

export const logoutQuery = async () => {
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

  return response.data;
};
