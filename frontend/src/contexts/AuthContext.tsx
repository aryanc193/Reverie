import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import * as authApi from "@/lib/api/auth";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/storage";
import { ApiError } from "@/lib/api/client";

interface AuthContextValue {
  user: authApi.PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: authApi.LoginInput) => Promise<void>;
  register: (input: authApi.RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<authApi.PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await authApi.getMe(accessToken);
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const tokens = await authApi.refresh(refreshToken);
            setTokens(tokens.accessToken, tokens.refreshToken);
            const me = await authApi.getMe(tokens.accessToken);
            setUser(me);
            setIsLoading(false);
            return;
          } catch {
            clearTokens();
          }
        }
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (input: authApi.LoginInput) => {
      const tokens = await authApi.login(input);
      setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await authApi.getMe(tokens.accessToken);
      setUser(me);
      await router.push("/");
    },
    [router],
  );

  const register = useCallback(
    async (input: authApi.RegisterInput) => {
      const tokens = await authApi.register(input);
      setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await authApi.getMe(tokens.accessToken);
      setUser(me);
      await router.push("/");
    },
    [router],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // ignore logout errors
      }
    }
    clearTokens();
    setUser(null);
    await router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
