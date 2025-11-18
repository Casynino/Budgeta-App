const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug: Log the API URL being used
console.log('[API] Using API_URL:', API_URL);
console.log('[API] Environment:', import.meta.env.MODE);

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

  const fullUrl = `${API_URL}${url}`;
  console.log(`[API] ${options.method || 'GET'} ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('[API] Fetch error:', error);
    
    // Provide more specific error messages
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5001');
    }
    
    throw error;
  }
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
