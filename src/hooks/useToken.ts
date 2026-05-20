import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const TOKEN_KEY = "carecloud_token";
const COOKIE_OPTIONS = { expires: 1, path: "/" } as const;

let _token: string | null = Cookies.get(TOKEN_KEY) ?? null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

export const getToken = () => _token;

export const setToken = (value: string) => {
  Cookies.set(TOKEN_KEY, value, COOKIE_OPTIONS);
  _token = value;
  notify();
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
  _token = null;
  notify();
};

export const useTokenHook = () => {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { token: _token, setToken, removeToken };
};
