import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../api/getUserData";
import { logoutQuery } from "../api/logoutQuery";
import { getUserData } from "../api/getUserData";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    const data = await getUserData();
    setUser(data.data.customers[0] ?? null);
  };

  const logout = async () => {
    try {
      await logoutQuery();
    } catch {
      // error
    }

    setUser(null);
    localStorage.removeItem("auth_user");
    document.cookie =
      "carecloud_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        setUser,
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
