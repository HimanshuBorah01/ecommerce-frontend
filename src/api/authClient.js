// Lightweight local auth client to replace external SDK references
const storageKey = "app_access_token";

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
    const res = await fetch(`/api/auth/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await wrapResponse(res);
    if (!res.ok) {
      const err = new Error(payload?.message || "Login failed");
      err.status = res.status;
      throw err;
    }
    if (payload?.access_token) setToken(payload.access_token);
    return payload;
  },
  loginWithProvider: (provider, returnTo) => {
    if (typeof window !== "undefined") {
      const url = `/api/auth/oauth/${provider}?returnTo=${encodeURIComponent(returnTo || window.location.href)}`;
      window.location.href = url;
    }
  },
  resetPasswordRequest: async (email) => {
    const res = await fetch("/api/auth/reset-password/request", {
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
    const res = await fetch("/api/auth/reset-password", {
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
    const res = await fetch("/api/auth/register", {
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
  verifyOtp: async (payload) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await wrapResponse(res);
    if (!res.ok) {
      const err = new Error(body?.message || "Verify failed");
      err.status = res.status;
      throw err;
    }
    if (body?.access_token) setToken(body.access_token);
    return body;
  },
  setToken,
  resendOtp: async (email) => {
    const res = await fetch("/api/auth/resend-otp", {
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
