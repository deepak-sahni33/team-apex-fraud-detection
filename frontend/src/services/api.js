// src/services/api.js
// Base Axios-like fetch wrapper for future backend integration.
// All API calls go through this module — never call fetch() directly in components.

import { ENV } from '../config/env';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

async function request(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const res = await fetch(`${ENV.API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data?.message || res.statusText, res.status, data);
  }

  return data;
}

export const api = {
  get:    (path, options)       => request(path, { ...options, method: 'GET' }),
  post:   (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put:    (path, body, options) => request(path, { ...options, method: 'PUT',  body }),
  delete: (path, options)       => request(path, { ...options, method: 'DELETE' }),
};

export { ApiError };
