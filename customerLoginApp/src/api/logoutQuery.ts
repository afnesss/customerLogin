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
        "Accept-Language": "cs, en-gb;q=0.8",
      },
    },
  );

  return response.data;
};
