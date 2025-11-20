// Determine API URL based on environment
const getApiUrl = () => {
  // Check if we're in production (deployed)
  const hostname = window.location.hostname;
  const isProduction = hostname.includes('vercel.app') || 
                       (hostname !== 'localhost' && hostname !== '127.0.0.1');
  
  if (isProduction) {
    // PRODUCTION: Always use Render backend
    return 'https://budgeta-app-vaxu.onrender.com/api';
  } else {
    // DEVELOPMENT: Use local backend
    return 'http://localhost:5001/api';
  }
};

const API_URL = getApiUrl();

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('budgeta_auth_token');
};

// Helper function to make authenticated requests with timeout
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_URL}${url}`;

  // Add timeout to prevent infinite loading (60 seconds for cold start)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send cookies (mobile-friendly)
      cache: 'no-cache', // Prevent mobile caching issues
      signal: controller.signal, // Add abort signal
    });

    clearTimeout(timeoutId);

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
    clearTimeout(timeoutId);
    
    // Handle abort/timeout
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Server is taking too long to respond. The backend may be waking up (Render free tier). Please try again in a few seconds.');
    }
    
    // Provide more specific error messages
    if (error.message === 'Failed to fetch') {
      const isProduction = window.location.hostname !== 'localhost';
      if (isProduction) {
        throw new Error('Cannot connect to backend. The server may be starting up (Render free tier takes 30-60 seconds). Please wait and try again.');
      } else {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5001');
      }
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

// ============ BUDGETS API ============
export const budgetsAPI = {
  getAll: async () => {
    return authFetch('/budgets');
  },

  create: async (budgetData) => {
    return authFetch('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  },

  update: async (id, budgetData) => {
    return authFetch(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  },

  delete: async (id) => {
    return authFetch(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ DEBTS API ============
export const debtsAPI = {
  getAll: async () => {
    return authFetch('/debts');
  },

  create: async (debtData) => {
    return authFetch('/debts', {
      method: 'POST',
      body: JSON.stringify(debtData),
    });
  },

  update: async (id, debtData) => {
    return authFetch(`/debts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(debtData),
    });
  },

  delete: async (id) => {
    return authFetch(`/debts/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ INVESTMENTS API ============
export const investmentsAPI = {
  getAll: async () => {
    return authFetch('/investments');
  },

  create: async (investmentData) => {
    return authFetch('/investments', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  },

  update: async (id, investmentData) => {
    return authFetch(`/investments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(investmentData),
    });
  },

  delete: async (id) => {
    return authFetch(`/investments/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ RECURRING PAYMENTS API ============
export const recurringAPI = {
  getAll: async () => {
    return authFetch('/recurring');
  },

  create: async (recurringData) => {
    return authFetch('/recurring', {
      method: 'POST',
      body: JSON.stringify(recurringData),
    });
  },

  update: async (id, recurringData) => {
    return authFetch(`/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recurringData),
    });
  },

  delete: async (id) => {
    return authFetch(`/recurring/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ GOALS API ============
export const goalsAPI = {
  getAll: async () => {
    return authFetch('/goals');
  },

  create: async (goalData) => {
    return authFetch('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  update: async (id, goalData) => {
    return authFetch(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  },

  delete: async (id) => {
    return authFetch(`/goals/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authAPI,
  accounts: accountsAPI,
  transactions: transactionsAPI,
  preferences: preferencesAPI,
  budgets: budgetsAPI,
  debts: debtsAPI,
  investments: investmentsAPI,
  recurring: recurringAPI,
  goals: goalsAPI,
};
