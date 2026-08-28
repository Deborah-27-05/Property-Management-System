const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
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
};
export const tenantsApi = {
  list: () => request('/api/tenants?per_page=100'),
  create: (payload) =>
    request('/api/tenants', { method: 'POST', body: JSON.stringify(payload) }),
};
export const paymentsApi = {
  list: () => request('/api/payments?per_page=100'),
  create: (payload) =>
    request('/api/payments', { method: 'POST', body: JSON.stringify(payload) }),
};
export const maintenanceApi = {
  list: () => request('/api/maintenance?per_page=100'),
  create: (payload) =>
    request('/api/maintenance', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/api/maintenance/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};
