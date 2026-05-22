import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";
import { USER_QUERY_KEY, useUserData } from "../api/user/getUserData";
import { userLogin } from "../api/user/loginQuery";
import { logoutQuery } from "../api/user/logoutQuery";
import { removeToken } from "../hooks/useToken";
import type { User } from "../types/customerDto";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: user, isLoading } = useUserData(isLoggedIn);

  const refreshUser = async () => {
    await queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });
  };

  const login = async (email: string, password: string) => {
    await userLogin(email, password);
    await refreshUser();
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await logoutQuery();
      setIsLoggedIn(false);
    } catch {
      // ignore logout API failure and still clear local auth state
    } finally {
      removeToken();
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        login,
        isAuthenticated: isLoggedIn,
        isBootstrapping: isLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
