import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage (instant, no API call)
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('budgeta_auth_token');
        const userData = localStorage.getItem('budgeta_user_data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          // Trust localStorage immediately - no API verification (too slow)
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('budgeta_auth_token');
        localStorage.removeItem('budgeta_user_data');
        setCurrentUser(null);
      }
    };

    initAuth();
  }, []);

  // Register new user with API
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const { email, password, firstName, lastName } = userData;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Password strength validation
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number');
      }

      // Call API to register user
      const response = await authAPI.register(email, password, firstName, lastName);

      // Save session
      localStorage.setItem('budgeta_auth_token', response.token);
      localStorage.setItem('budgeta_user_data', JSON.stringify(response.user));

      setCurrentUser(response.user);
      setLoading(false);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Login user with API
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call API to login
      const response = await authAPI.login(email, password);

      // Save session
      localStorage.setItem('budgeta_auth_token', response.token);
      localStorage.setItem('budgeta_user_data', JSON.stringify(response.user));

      setCurrentUser(response.user);
      setLoading(false);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('[AuthContext] ❌ Login failed:', error);
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('budgeta_auth_token');
    localStorage.removeItem('budgeta_user_data');
    setCurrentUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Update session locally (API update would go here in production)
      const updatedSession = {
        ...currentUser,
        ...updates,
      };

      localStorage.setItem('budgeta_user_data', JSON.stringify(updatedSession));
      setCurrentUser(updatedSession);

      return { success: true, user: updatedSession };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Change password (would call API in production)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(newPassword)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(newPassword)) {
        throw new Error('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(newPassword)) {
        throw new Error('Password must contain at least one number');
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password (would send email via API in production)
  const resetPassword = async (email) => {
    try {
      setError(null);

      // In production, call API to send password reset email
      return { 
        success: true, 
        message: 'If an account exists, a reset link has been sent to your email' 
      };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
