const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const TOKEN_KEY = 'nyumba_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses (e.g. 500s from an unhandled error) may not return JSON
  }

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const propertiesApi = {
  list: () => request('/api/properties?per_page=100'),
  create: (payload) =>
    request('/api/properties', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/properties/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/properties/${id}`, { method: 'DELETE' }),
};

export const unitsApi = {
  list: () => request('/api/units?per_page=200'),
  create: (payload) =>
    request('/api/units', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/units/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/units/${id}`, { method: 'DELETE' }),
};

export const tenantsApi = {
  list: () => request('/api/tenants?per_page=100'),
  create: (payload) =>
    request('/api/tenants', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/tenants/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/tenants/${id}`, { method: 'DELETE' }),
};

export const paymentsApi = {
  list: () => request('/api/payments?per_page=100'),
  create: (payload) =>
    request('/api/payments', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/payments/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/payments/${id}`, { method: 'DELETE' }),
};

export const maintenanceApi = {
  list: () => request('/api/maintenance?per_page=100'),
  create: (payload) =>
    request('/api/maintenance', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/maintenance/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/maintenance/${id}`, { method: 'DELETE' }),
};

export const authApi = {
  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me'),
};