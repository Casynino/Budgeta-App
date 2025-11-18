const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('budgeta_auth_token');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// ============ AUTH API ============
export const authAPI = {
  register: async (email, password, firstName, lastName) => {
    return authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  },

  login: async (email, password) => {
    return authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async () => {
    return authFetch('/auth/me');
  },
};

// ============ ACCOUNTS API ============
export const accountsAPI = {
  getAll: async () => {
    return authFetch('/accounts');
  },

  getById: async (id) => {
    return authFetch(`/accounts/${id}`);
  },

  create: async (accountData) => {
    return authFetch('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  },

  update: async (id, accountData) => {
    return authFetch(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  },

  delete: async (id) => {
    return authFetch(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },

  setDefault: async (id) => {
    return authFetch(`/accounts/${id}/set-default`, {
      method: 'PATCH',
    });
  },
};

// ============ TRANSACTIONS API ============
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';
    
    return authFetch(url);
  },

  getById: async (id) => {
    return authFetch(`/transactions/${id}`);
  },

  create: async (transactionData) => {
    return authFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  update: async (id, transactionData) => {
    return authFetch(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  },

  delete: async (id) => {
    return authFetch(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/transactions/stats/summary?${queryString}` : '/transactions/stats/summary';
    
    return authFetch(url);
  },
};

// ============ PREFERENCES API ============
export const preferencesAPI = {
  get: async () => {
    return authFetch('/preferences');
  },

  update: async (preferences) => {
    return authFetch('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};

export default {
  auth: authAPI,
  accounts: accountsAPI,
  transactions: transactionsAPI,
  preferences: preferencesAPI,
};
