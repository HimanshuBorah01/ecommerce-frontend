// Reusable API client using native Fetch API.
// This file is used by the app for normal backend requests such as products, cart, wishlist, and account data.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Use the same access token storage key as the auth client and app params
const TOKEN_KEY = "app_access_token";

// Read token from browser storage.
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Save token after login/refresh.
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// Remove token during logout.
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// Attach auth header to every protected request.
const buildHeaders = (extra = {}) => {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Convert backend response to JSON or throw a useful error.
const handleResponse = async (res) => {
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: res.statusText };
    }
    const error = new Error(errorData?.message || "Request failed");
    error.status = res.status;
    error.data = errorData;
    throw error;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
};

// Build the full backend URL for the request.
const makeApiUrl = (path) => {
  // If the caller already supplied a complete URL, use it directly so we
  // never accidentally double the API base prefix (e.g. /api/v1/api/v1/...).
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  // Avoid re-prefixing the base if it is already present in the path.
  const baseWithoutLeadingSlash = normalizedBase.replace(/^\/+/, "");
  if (
    baseWithoutLeadingSlash &&
    normalizedPath.startsWith(baseWithoutLeadingSlash)
  ) {
    return new URL(`/${normalizedPath}`, window.location.origin).toString();
  }

  return new URL(
    `${normalizedBase}/${normalizedPath}`,
    window.location.origin,
  ).toString();
};

// Refresh the access token using the refresh cookie. Returns true on success.
const refreshAccessToken = async () => {
  try {
    const res = await fetch(
      `${BASE_URL.replace(/\/$/, "")}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!res.ok) return false;
    const data = await res.json();
    const token =
      data?.accessToken || data?.access_token || data?.token || null;
    if (token) setToken(token);
    return !!token;
  } catch {
    return false;
  }
};

const apiFetch = async (path, options = {}) => {
  const doFetch = () =>
    fetch(makeApiUrl(path), {
      ...options,
      credentials: "include", // send refresh cookie with every request
      headers: buildHeaders(options.headers),
    });
  let res = await doFetch();

  // If the request is unauthorized and we have a token, try refreshing once and retry.
  if (res.status === 401 && getToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await doFetch();
    } else {
      // Refresh failed — clear token so the app can redirect to login cleanly.
      removeToken();
    }
  }
  return handleResponse(res);
};

export const api = {
  // Generic GET request for public or protected data.
  get: (path, params) => {
    const url = new URL(makeApiUrl(path));
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v != null && url.searchParams.set(k, v),
      );
    return apiFetch(url.toString(), { method: "GET" });
  },

  // Generic POST request.
  post: (path, body) =>
    apiFetch(makeApiUrl(path), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Generic PUT request.
  put: (path, body) =>
    apiFetch(makeApiUrl(path), {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  // Generic PATCH request.
  patch: (path, body) =>
    apiFetch(makeApiUrl(path), {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Generic DELETE request.
  delete: (path) =>
    apiFetch(makeApiUrl(path), {
      method: "DELETE",
    }),

  // Multipart upload for files such as profile images.
  postMultipart: (path, formData) => {
    const headers = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(makeApiUrl(path), {
      method: "POST",
      credentials: "include",
      headers,
      body: formData,
    }).then(handleResponse);
  },
};

export { getToken, setToken, removeToken };
