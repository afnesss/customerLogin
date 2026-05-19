import Cookies from "js-cookie";
import { api } from "./clientConfig";

let createTokenPromise: Promise<string | undefined> | null = null;

export const createTokenId = async () => {
  const existingToken = Cookies.get("carecloud_token");

  if (existingToken) {
    return existingToken;
  }

  if (createTokenPromise) {
    return createTokenPromise;
  }

  createTokenPromise = (async () => {
    try {
      const response = await api.post(`/tokens`, {
        device: {
          device_id: crypto.randomUUID(),
          device_system: navigator.platform,
          device_name: "React Web App",
          device_type: "Web",
        },
        setup: {
          language_id: "en",
          allowed_gps: true,
          allowed_notifications: false,
        },
        external_application_id: import.meta.env.VITE_EXTERNAL_APP_ID,
      });
      console.log(response.data);
      const token = response.data.data.token_id;
      Cookies.set("carecloud_token", token, {
        path: "/",
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      return token;
    } catch (error) {
      console.log("get token error: ", error);
      return undefined;
    } finally {
      createTokenPromise = null;
    }
  })();

  return createTokenPromise;
};
