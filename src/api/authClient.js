// Auth client for the app's authentication flow.
// Talks to the backend auth endpoints and manages the access token.
const storageKey = "app_access_token";
const AUTH_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Read the saved access token from browser storage.
const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKey);
};

// Save the access token after login or refresh.
const setToken = (token) => {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(storageKey, token);
};

// Remove token during logout.
const clearToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
};

const wrapResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { message: text };
  }
};

const handleError = (res, payload) => {
  const err = new Error(payload?.message || "Request failed");
  err.status = res.status;
  err.data = payload;
  throw err;
};

export const auth = {
  // Return the current logged-in user using the access token.
  me: async () => {
    let res = await fetch(`${AUTH_BASE}/auth/me`, {
      credentials: "include",
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    });

    // If unauthorized, try refreshing the access token once using the cookie.
    if (res.status === 401 && getToken()) {
      try {
        await auth.refresh();
        res = await fetch(`${AUTH_BASE}/auth/me`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      } catch (refreshErr) {
        const payload = await wrapResponse(res);
        handleError(res, payload);
      }
    }

    if (!res.ok) {
      const payload = await wrapResponse(res);
      handleError(res, payload);
    }

    return wrapResponse(res);
  },

  // Clear auth state and redirect to login.
  logout: async () => {
    let res;
    try {
      res = await fetch(`${AUTH_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      });
    } catch {
      // Network error — still clear local state.
      clearToken();
      return;
    }
    if (!res.ok) {
      // Even if the backend rejects, clear local state.
      clearToken();
    }
    clearToken();
    return wrapResponse(res);
  },

  redirectToLogin: (redirectUrl) => {
    if (typeof window !== "undefined") {
      window.location.href = `/login?returnTo=${encodeURIComponent(
        redirectUrl || window.location.href,
      )}`;
    }
  },

  // Login with email and password.
  loginViaEmailPassword: async (email, password) => {
    const res = await fetch(`${AUTH_BASE}/auth/login`, {
      method: "POST",
      credentials: "include", // accept refresh cookie from server
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await wrapResponse(res);
    if (!res.ok) {
      handleError(res, payload);
    }
    const token =
      payload?.accessToken || payload?.access_token || payload?.token;
    if (token) setToken(token);
    return payload;
  },

  // Request password reset email.
  resetPasswordRequest: async (email) => {
    const res = await fetch(`${AUTH_BASE}/auth/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await wrapResponse(res);
    if (!res.ok) handleError(res, payload);
    return payload;
  },

  // Complete password reset with the reset token.
  resetPassword: async (payload) => {
    const { resetToken, newPassword } = payload || {};
    const res = await fetch(`${AUTH_BASE}/auth/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, newPassword }),
    });
    const body = await wrapResponse(res);
    if (!res.ok) handleError(res, body);
    return body;
  },

  // Register a new user account.
  register: async (payload) => {
    const res = await fetch(`${AUTH_BASE}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await wrapResponse(res);
    if (!res.ok) handleError(res, body);
    return body;
  },

  // Verify email using the token from the verification link.
  verifyEmail: async (payload) => {
    const res = await fetch(`${AUTH_BASE}/auth/verify-email`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await wrapResponse(res);
    if (!res.ok) handleError(res, body);
    const token = body?.accessToken || body?.access_token || body?.token;
    if (token) setToken(token);
    return body;
  },

  // Refresh the access token using the refresh cookie stored by the browser.
  refresh: async () => {
    const res = await fetch(`${AUTH_BASE}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    const body = await wrapResponse(res);
    if (!res.ok) handleError(res, body);
    const token = body?.accessToken || body?.access_token || body?.token;
    if (token) setToken(token);
    return body;
  },

  // Resend the email verification link.
  resendVerificationEmail: async (email) => {
    const res = await fetch(`${AUTH_BASE}/auth/resend-verification-email`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await wrapResponse(res);
    if (!res.ok) handleError(res, payload);
    return payload;
  },

  setToken,
  getToken,
};

export default auth;
