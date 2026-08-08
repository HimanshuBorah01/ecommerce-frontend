import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import auth from "@/api/authClient";
import { getToken, setToken, removeToken } from "@/lib/api";

const AuthContext = createContext();

/**
 * Normalize the user object returned by the backend `/auth/me` endpoint.
 * Backend returns `{ user: { id, name, email, phone, role, isEmailVerified } }`.
 */
const normalizeUser = (data) => {
  const u = data?.user || data?.data || data || null;
  if (!u) return null;
  return {
    id: u._id || u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isEmailVerified: u.isEmailVerified,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Fetch the current user from the backend using the access token.
  const checkUserAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }
    try {
      setIsLoadingAuth(true);
      const data = await auth.me();
      const realUser = normalizeUser(data);
      setUser(realUser);
      setIsAuthenticated(!!realUser);
      setAuthError(null);
    } catch (error) {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      if (error?.status === 401 || error?.status === 403) {
        setAuthError({
          type: "auth_required",
          message: "Authentication required",
        });
      }
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  // Login with email/password and load the user.
  const login = async (email, password) => {
    const data = await auth.loginViaEmailPassword(email, password);
    const token = data?.accessToken || data?.access_token || data?.token;
    if (token) setToken(token);
    await checkUserAuth();
    return data;
  };

  // Register a new user.
  const register = async (payload) => {
    return auth.register(payload);
  };

  // Logout: revoke the backend session, then clear local auth state.
  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      // Ignore network/backend errors — always clear local state.
    }
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
  }, []);

  // Redirect to the login page with a safe returnTo.
  const navigateToLogin = () => {
    auth.redirectToLogin(window.location.href);
  };

  const updateUser = (updated) => setUser((prev) => ({ ...prev, ...updated }));

  const refetchUser = useCallback(() => checkUserAuth(), [checkUserAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoading: isLoadingAuth,
        authError,
        authChecked,
        login,
        register,
        logout,
        updateUser,
        refetchUser,
        checkUserAuth,
        navigateToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
