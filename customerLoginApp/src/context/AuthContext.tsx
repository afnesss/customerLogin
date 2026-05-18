import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../api/getUserData";
import { getCookie } from "../api/clientConfig";
import { createTokenId } from "../api/tokenQuery";
import { getUserData } from "../api/getUserData";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    document.cookie =
      "carecloud_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        let token = getCookie("carecloud_token");

        if (!token) {
          await createTokenId();
          token = getCookie("carecloud_token");
        }

        if (token) {
          try {
            const data = await getUserData();
            setUser(data.data.customers[0] ?? null);
          } catch {
            setUser(null);
          }
        }
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
