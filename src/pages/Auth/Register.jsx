import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 2, text: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 3, text: 'One lowercase letter', regex: /[a-z]/ },
    { id: 4, text: 'One number', regex: /[0-9]/ },
  ];

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 via-purple-500 to-primary-400 bg-clip-text text-transparent mb-3">
            Budgeta
          </h1>
          <p className="text-gray-400 text-lg">Create your account and start managing your finances</p>
        </div>

        {/* Register Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-card p-8">
          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <p className="text-danger-400 text-sm">{error || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                icon={<User className="w-4 h-4" />}
                className="bg-dark-700 border-dark-600 text-white"
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                icon={<User className="w-4 h-4" />}
                className="bg-dark-700 border-dark-600 text-white"
              />
            </div>

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

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2 p-4 bg-dark-700 rounded-xl">
                <p className="text-sm text-gray-400 font-medium mb-2">Password requirements:</p>
                {passwordRequirements.map((req) => {
                  const isMet = req.regex.test(formData.password);
                  return (
                    <div key={req.id} className="flex items-center gap-2">
                      {isMet ? (
                        <CheckCircle2 className="w-4 h-4 text-success-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                      <span className={`text-sm ${isMet ? 'text-success-500' : 'text-gray-500'}`}>
                        {req.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                icon={<Lock className="w-4 h-4" />}
                className="bg-dark-700 border-dark-600 text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-400 hover:text-primary-300 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-400 hover:text-primary-300 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              icon={<UserPlus className="w-5 h-5" />}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
