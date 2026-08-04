// Minimal axios-like client using fetch to replace external SDK helper
export function createAxiosClient({
  baseURL = "",
  headers = {},
  token = null,
  interceptResponses = false,
} = {}) {
  const makeUrl = (path) =>
    `${baseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const request = async (method, path, options = {}) => {
    const res = await fetch(makeUrl(path), {
      method,
      headers: {
        ...headers,
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    if (!res.ok) {
      const err = new Error(
        data?.message || res.statusText || "Request failed",
      );
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  };

  return {
    get: (path) => request("GET", path),
    post: (path, body) =>
      request("POST", path, {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    put: (path, body) =>
      request("PUT", path, {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    delete: (path) => request("DELETE", path),
  };
}
