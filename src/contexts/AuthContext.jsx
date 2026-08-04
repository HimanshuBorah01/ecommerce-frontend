import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api, setToken, removeToken, getToken } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.get("/auth/me");
      setUser(data?.user || data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    const token = data?.token || data?.accessToken || data?.data?.token;
    if (token) {
      setToken(token);
      await fetchMe();
    }
    return data;
  };

  const register = async (payload) => {
    const data = await api.post("/auth/register", payload);
    return data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const updateUser = (updated) => setUser((prev) => ({ ...prev, ...updated }));

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        refetchUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
