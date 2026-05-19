import { api, getCookie } from "./clientConfig";

export const logoutQuery = async () => {
  const token = getCookie("carecloud_token");

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
