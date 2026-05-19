import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCookie } from "../api/clientConfig";
import type { User } from "../types/customerDto";
import { getUserData } from "../api/getUserData";
import { logoutQuery } from "../api/logoutQuery";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshUser = async () => {
    const data = await getUserData();
    setUser(data.data.customers[0] ?? null);
  };

  const logout = async () => {
    try {
      setUser(null);
      document.cookie =
        "carecloud_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      await logoutQuery();
    } catch {
      // ignore logout API failure and still clear local auth state
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!getCookie("carecloud_token")) {
          setUser(null);
          return;
        }

        await refreshUser();
      } catch {
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isBootstrapping,
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
