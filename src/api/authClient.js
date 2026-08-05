// Lightweight local auth client to replace external SDK references
const storageKey = "app_access_token";
const AUTH_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKey);
};

const setToken = (token) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, token);
};

const clearToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
};

const wrapResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

export const auth = {
  me: async () => {
    // Call /me with access token. If unauthorized, attempt a refresh once.
    let res = await fetch(`${AUTH_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.status === 401) {
      // Try refreshing access token using refresh cookie
      try {
        await auth.refresh();
        res = await fetch(`${AUTH_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      } catch (refreshErr) {
        const payload = await wrapResponse(res);
        const err = new Error(payload?.message || "Unauthorized");
        err.status = res.status;
        err.data = payload;
        throw err;
      }
    }

    if (!res.ok) {
      const payload = await wrapResponse(res);
      const err = new Error(payload?.message || "Unauthorized");
      err.status = res.status;
      err.data = payload;
      throw err;
    }

    return wrapResponse(res);
  },
  logout: (redirectUrl) => {
    clearToken();
    if (redirectUrl && typeof window !== "undefined") {
      window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
    }
    return Promise.resolve();
  },
  redirectToLogin: (redirectUrl) => {
    if (typeof window !== "undefined") {
      window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl || window.location.href)}`;
    }
  },
  loginViaEmailPassword: async (email, password) => {
    const res = await fetch(`${AUTH_BASE}/auth/login`, {
      method: "POST",
      credentials: "include", // accept refresh cookie from server
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await wrapResponse(res);
    if (!res.ok) {
      const err = new Error(payload?.message || "Login failed");
      err.status = res.status;
      throw err;
    }
    const token =
      payload?.accessToken || payload?.access_token || payload?.token;
    if (token) setToken(token);
    return payload;
  },
  loginWithProvider: (provider, returnTo) => {
    if (typeof window !== "undefined") {
      const url = `${AUTH_BASE}/auth/oauth/${provider}?returnTo=${encodeURIComponent(returnTo || window.location.href)}`;
      window.location.href = url;
    }
  },
  resetPasswordRequest: async (email) => {
    const res = await fetch(`${AUTH_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const payload = await wrapResponse(res);
      const err = new Error(payload?.message || "Request failed");
      err.status = res.status;
      throw err;
    }
    return wrapResponse(res);
  },
  resetPassword: async (resetToken, newPassword) => {
    const res = await fetch(`${AUTH_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });
    if (!res.ok) {
      const payload = await wrapResponse(res);
      const err = new Error(payload?.message || "Reset failed");
      err.status = res.status;
      throw err;
    }
    return wrapResponse(res);
  },
  register: async (payload) => {
    const res = await fetch(`${AUTH_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await wrapResponse(res);
    if (!res.ok) {
      const err = new Error(body?.message || "Register failed");
      err.status = res.status;
      throw err;
    }
    return body;
  },
  verifyEmail: async (payload) => {
    const res = await fetch(`${AUTH_BASE}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await wrapResponse(res);
    if (!res.ok) {
      const err = new Error(body?.message || "Verification failed");
      err.status = res.status;
      throw err;
    }
    const token = body?.accessToken || body?.access_token || body?.token;
    if (token) setToken(token);
    return body;
  },
  setToken,

  // Attempt to refresh access token using refresh cookie on the server.
  refresh: async () => {
    const res = await fetch(`${AUTH_BASE}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    const body = await wrapResponse(res);
    if (!res.ok) {
      const err = new Error(body?.message || "Refresh failed");
      err.status = res.status;
      throw err;
    }
    const token = body?.accessToken || body?.access_token || body?.token;
    if (token) setToken(token);
    return body;
  },
  resendVerificationEmail: async (email) => {
    const res = await fetch(`${AUTH_BASE}/auth/resend-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const payload = await wrapResponse(res);
      const err = new Error(payload?.message || "Resend failed");
      err.status = res.status;
      throw err;
    }
    return wrapResponse(res);
  },
};

export default auth;
