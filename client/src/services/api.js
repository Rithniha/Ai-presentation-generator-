const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Custom request helper that handles credentials, headers, and standard error handling.
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  // Automatically configure request content type and CORS credential configurations
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    // Required to sync HTTP-only secure cookies across cross-origin requests
    credentials: 'include'
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || payload.message || `API request failed with status: ${response.status}`);
  }

  return payload;
};

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options })
};
