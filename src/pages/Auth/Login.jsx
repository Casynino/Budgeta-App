import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Signing in...');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Check if in production (backend on Render)
    const isProduction = window.location.hostname.includes('vercel.app');
    
    // Show "waking up" message immediately in production since backend always sleeps
    if (isProduction) {
      setLoadingMessage('Connecting to backend (may take 30-60 seconds if server is asleep)...');
    } else {
      setLoadingMessage('Signing in...');
    }

    // Show "waking up backend" message after 2 seconds if still loading
    const wakingTimer = setTimeout(() => {
      setLoadingMessage('Waking up backend server (this may take 30-60 seconds)...');
    }, 2000);

    try {
      const result = await login(formData.email, formData.password);
      clearTimeout(wakingTimer);
      setLoadingMessage('Success! Redirecting...');
      
      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/dashboard');
    } catch (err) {
      clearTimeout(wakingTimer);
      console.error('[Login] Error:', err);
      setError(err.message || 'Failed to login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 via-purple-500 to-primary-400 bg-clip-text text-transparent mb-3">
            Budgeta
          </h1>
          <p className="text-gray-400 text-lg">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-card p-8">
          {/* Loading Message */}
          {loading && (
            <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary-400 text-sm font-medium">{loadingMessage}</p>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-1.5 mt-3">
                <div className="bg-primary-500 h-1.5 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {!loading && (error || authError) && (
            <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <p className="text-danger-400 text-sm">{error || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              icon={<Mail className="w-4 h-4" />}
              className="bg-dark-700 border-dark-600 text-white"
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                icon={<Lock className="w-4 h-4" />}
                className="bg-dark-700 border-dark-600 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              icon={<LogIn className="w-5 h-5" />}
            >
              {loading ? loadingMessage : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login (Placeholder) */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-white text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-white text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
