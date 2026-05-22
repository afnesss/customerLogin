import { getToken, removeToken, setToken } from "../hooks/useToken";
import { api } from "./clientConfig";
import { v4 as uuidv4 } from "uuid";

let createTokenPromise: Promise<string | undefined> | null = null;

export const createTokenId = async () => {
  const existingToken = getToken();

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
          device_id: uuidv4(),
          device_system: navigator.platform,
          device_name: "React Web App",
          device_type: "Web",
        },
        setup: {
          language_id: "en",
          allowed_gps: true,
          allowed_notifications: false,
        },
      });
      console.log(response.data);
      const token = response.data.data.token_id;
      setToken(token);

      return token;
    } catch (error) {
      removeToken();
      throw error;
    } finally {
      createTokenPromise = null;
    }
  })();

  return createTokenPromise;
};
