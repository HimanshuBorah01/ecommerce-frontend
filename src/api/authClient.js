// Lightweight local auth client for the app's authentication flow.
// This file talks to the backend auth endpoints and manages the access token.
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
  window.localStorage.setItem(storageKey, token);
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
    return text;
  }
};

export const auth = {
  // Check the current logged-in user using the access token.
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

  // Clear auth state and redirect to login.
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

  // Login with email and password.
  loginViaEmailPassword: async (email, password) => {
    const res = await fetch(`${AUTH_BASE}/auth/login`, {
      method: "POST",
      credentials: "include", // accept refresh cookie from server
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await wrapResponse(res);
    // Save last raw login response for client-side debugging (temporary).
    try {
      const headers = {};
      res.headers.forEach((v, k) => (headers[k] = v));
      window.__lastAuthLoginResponse = {
        status: res.status,
        headers,
        body: payload,
      };
    } catch (e) {
      /* ignore in non-browser env */
    }
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

  // Request password reset email.
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

  // Complete password reset with the reset token.
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

  // Register a new user account.
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

  // Verify email using the token from the verification link.
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

  // Refresh the access token using the refresh cookie stored by the browser.
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

  // Resend the email verification link.
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
