import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
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
          <p className="text-gray-400 text-lg">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-card p-8">
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-success-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-success-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-gray-400">
                  If an account exists with <span className="text-white font-medium">{email}</span>,
                  we've sent you a password reset link.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="primary" size="lg" fullWidth icon={<ArrowLeft className="w-5 h-5" />}>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Forgot password?</h2>
                <p className="text-gray-400">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-xl">
                  <p className="text-danger-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  icon={<Mail className="w-4 h-4" />}
                  className="bg-dark-700 border-dark-600 text-white"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                  icon={<Send className="w-5 h-5" />}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" size="lg" fullWidth icon={<ArrowLeft className="w-5 h-5" />}>
                    Back to Login
                  </Button>
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
