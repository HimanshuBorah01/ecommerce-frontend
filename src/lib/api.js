// Reusable API client using native Fetch API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Use the same access token storage key as the auth client and app params
const TOKEN_KEY = "app_access_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const buildHeaders = (extra = {}) => {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

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

const makeApiUrl = (path) => {
  const normalizedBase = BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");
  return new URL(
    `${normalizedBase}/${normalizedPath}`,
    window.location.origin,
  ).toString();
};

export const api = {
  get: (path, params) => {
    const url = new URL(makeApiUrl(path));
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v != null && url.searchParams.set(k, v),
      );
    return fetch(url.toString(), { headers: buildHeaders() }).then(
      handleResponse,
    );
  },
  post: (path, body) =>
    fetch(makeApiUrl(path), {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  put: (path, body) =>
    fetch(makeApiUrl(path), {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  patch: (path, body) =>
    fetch(makeApiUrl(path), {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  delete: (path) =>
    fetch(makeApiUrl(path), {
      method: "DELETE",
      headers: buildHeaders(),
    }).then(handleResponse),
  postMultipart: (path, formData) => {
    const headers = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(makeApiUrl(path), {
      method: "POST",
      headers,
      body: formData,
    }).then(handleResponse);
  },
};

export { getToken, setToken, removeToken };
