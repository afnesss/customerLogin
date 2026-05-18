import axios from "axios";
import { api } from "./clientConfig";

type LoginPayload = {
  user_external_application_id: string;
  login: string;
  password: string;
};

export type LoginResponse = unknown;

export class UserLoginError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "UserLoginError";
    this.status = status;
    this.details = details;
  }
}

export const userLogin = async (login: string, password: string) => {
  const payload: LoginPayload = {
    user_external_application_id: import.meta.env.VITE_EXTERNAL_APP_ID,
    login,
    password,
  };

  try {
    const res = await api.post<LoginResponse>("/users/actions/login", payload, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new UserLoginError(
        error.response?.data?.message || error.message || "User login failed",
        error.response?.status,
        error.response?.data,
      );
    }

    throw new UserLoginError("Unexpected user login error");
  }
};
