import axios from "axios";
import { api, getCookie } from "./clientConfig";

type LoginPayload = {
  login_type: string;
  login_value: string;
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
    login_type: "email",
    login_value: login,
    password,
  };
  const token = getCookie("carecloud_token");

  try {
    const res = await api.post<LoginResponse>(
      `/tokens/${token}/actions/login`,
      payload,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
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
