// Reusable API client using native Fetch API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('shopy_token');

const setToken = (token) => localStorage.setItem('shopy_token', token);

const removeToken = () => localStorage.removeItem('shopy_token');

const buildHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorData;
    try { errorData = await res.json(); } catch { errorData = { message: res.statusText }; }
    const error = new Error(errorData?.message || 'Request failed');
    error.status = res.status;
    error.data = errorData;
    throw error;
  }
  try { return await res.json(); } catch { return null; }
};

export const api = {
  get: (path, params) => {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
    return fetch(url.toString(), { headers: buildHeaders() }).then(handleResponse);
  },
  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: buildHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, { method: 'PATCH', headers: buildHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  delete: (path) =>
    fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: buildHeaders() }).then(handleResponse),
  postMultipart: (path, formData) => {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData }).then(handleResponse);
  },
};

export { getToken, setToken, removeToken };