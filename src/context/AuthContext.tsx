import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import { logoutQuery } from "../api/user/logoutQuery";
import { removeToken, useTokenHook } from "../hooks/useToken";
import type { User } from "../types/customerDto";
import { USER_QUERY_KEY, useUserData } from "../api/user/getUserData";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token } = useTokenHook();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUserData();

  const refreshUser = async () => {
    await queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });
  };

  const logout = async () => {
    try {
      await logoutQuery();
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
        isAuthenticated: Boolean(token) && Boolean(user),
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
