import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

const ApiTest = () => {
  const [tests, setTests] = useState({
    envLoaded: { status: 'pending', message: '' },
    healthCheck: { status: 'pending', message: '' },
    corsCheck: { status: 'pending', message: '' },
    registerTest: { status: 'pending', message: '' },
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const runTests = async () => {
    // Test 1: Environment Variable
    setTests(prev => ({
      ...prev,
      envLoaded: {
        status: 'testing',
        message: 'Checking environment variables...'
      }
    }));

    if (import.meta.env.VITE_API_URL) {
      setTests(prev => ({
        ...prev,
        envLoaded: {
          status: 'success',
          message: `✓ VITE_API_URL loaded: ${API_URL}`
        }
      }));
    } else {
      setTests(prev => ({
        ...prev,
        envLoaded: {
          status: 'error',
          message: '✗ VITE_API_URL not found, using fallback: ' + API_URL
        }
      }));
    }

    // Test 2: Health Check
    setTests(prev => ({
      ...prev,
      healthCheck: {
        status: 'testing',
        message: 'Testing backend health endpoint...'
      }
    }));

    try {
      const healthUrl = API_URL.replace('/api', '/health');
      const response = await fetch(healthUrl);
      const data = await response.json();
      
      if (response.ok) {
        setTests(prev => ({
          ...prev,
          healthCheck: {
            status: 'success',
            message: `✓ Backend is running: ${data.message}`
          }
        }));
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        healthCheck: {
          status: 'error',
          message: `✗ Cannot reach backend: ${error.message}`
        }
      }));
    }

    // Test 3: CORS Check
    setTests(prev => ({
      ...prev,
      corsCheck: {
        status: 'testing',
        message: 'Testing CORS configuration...'
      }
    }));

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'OPTIONS',
      });
      
      const corsHeaders = {
        origin: response.headers.get('Access-Control-Allow-Origin'),
        credentials: response.headers.get('Access-Control-Allow-Credentials'),
      };

      if (corsHeaders.origin) {
        setTests(prev => ({
          ...prev,
          corsCheck: {
            status: 'success',
            message: `✓ CORS configured: ${corsHeaders.origin}`
          }
        }));
      } else {
        setTests(prev => ({
          ...prev,
          corsCheck: {
            status: 'warning',
            message: '⚠ CORS headers not visible (may still work)'
          }
        }));
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        corsCheck: {
          status: 'error',
          message: `✗ CORS test failed: ${error.message}`
        }
      }));
    }

    // Test 4: Register Endpoint Test
    setTests(prev => ({
      ...prev,
      registerTest: {
        status: 'testing',
        message: 'Testing registration endpoint...'
      }
    }));

    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTests(prev => ({
          ...prev,
          registerTest: {
            status: 'success',
            message: `✓ Registration works! User created: ${data.user.email}`
          }
        }));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        registerTest: {
          status: 'error',
          message: `✗ Registration failed: ${error.message}`
        }
      }));
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-success-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-danger-500" />;
      case 'testing':
        return <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />;
      case 'warning':
        return <div className="w-6 h-6 text-warning-500">⚠</div>;
      default:
        return <div className="w-6 h-6 text-gray-500">○</div>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-success-500/50 bg-success-500/10';
      case 'error':
        return 'border-danger-500/50 bg-danger-500/10';
      case 'testing':
        return 'border-primary-500/50 bg-primary-500/10';
      case 'warning':
        return 'border-warning-500/50 bg-warning-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const allTestsPassed = Object.values(tests).every(test => test.status === 'success');

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">API Connection Test</h1>
          <p className="text-gray-400">Testing backend API connection and functionality</p>
        </div>

        {/* Configuration Info */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">API URL:</span>
              <span className="text-white font-mono">{API_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Environment:</span>
              <span className="text-white font-mono">{import.meta.env.MODE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frontend URL:</span>
              <span className="text-white font-mono">{window.location.origin}</span>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4 mb-6">
          {/* Test 1 */}
          <div className={`border rounded-xl p-6 ${getStatusColor(tests.envLoaded.status)}`}>
            <div className="flex items-start gap-4">
              {getStatusIcon(tests.envLoaded.status)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  1. Environment Variables
                </h3>
                <p className="text-gray-300 text-sm">{tests.envLoaded.message}</p>
              </div>
            </div>
          </div>

          {/* Test 2 */}
          <div className={`border rounded-xl p-6 ${getStatusColor(tests.healthCheck.status)}`}>
            <div className="flex items-start gap-4">
              {getStatusIcon(tests.healthCheck.status)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  2. Backend Health Check
                </h3>
                <p className="text-gray-300 text-sm">{tests.healthCheck.message}</p>
              </div>
            </div>
          </div>

          {/* Test 3 */}
          <div className={`border rounded-xl p-6 ${getStatusColor(tests.corsCheck.status)}`}>
            <div className="flex items-start gap-4">
              {getStatusIcon(tests.corsCheck.status)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  3. CORS Configuration
                </h3>
                <p className="text-gray-300 text-sm">{tests.corsCheck.message}</p>
              </div>
            </div>
          </div>

          {/* Test 4 */}
          <div className={`border rounded-xl p-6 ${getStatusColor(tests.registerTest.status)}`}>
            <div className="flex items-start gap-4">
              {getStatusIcon(tests.registerTest.status)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  4. Registration Endpoint
                </h3>
                <p className="text-gray-300 text-sm">{tests.registerTest.message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className={`border-2 rounded-xl p-6 ${
          allTestsPassed 
            ? 'border-success-500 bg-success-500/10' 
            : 'border-warning-500 bg-warning-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {allTestsPassed ? '✓ All Tests Passed!' : '⚠ Some Tests Failed'}
              </h3>
              <p className="text-gray-300">
                {allTestsPassed 
                  ? 'Your API connection is working correctly!' 
                  : 'Please check the failed tests above and follow the troubleshooting guide.'}
              </p>
            </div>
            <button
              onClick={runTests}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Run Tests Again
            </button>
          </div>
        </div>

        {/* Troubleshooting */}
        {!allTestsPassed && (
          <div className="mt-6 bg-dark-800 border border-dark-600 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Troubleshooting</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <strong className="text-white">1. Backend not running?</strong><br />
                Run: <code className="bg-dark-700 px-2 py-1 rounded">cd server && npm run dev</code>
              </p>
              <p>
                <strong className="text-white">2. Wrong API URL?</strong><br />
                Check <code className="bg-dark-700 px-2 py-1 rounded">.env</code> file has: 
                <code className="bg-dark-700 px-2 py-1 rounded ml-2">VITE_API_URL=http://localhost:5001/api</code>
              </p>
              <p>
                <strong className="text-white">3. Environment not loaded?</strong><br />
                Restart frontend: <code className="bg-dark-700 px-2 py-1 rounded">npm run dev</code>
              </p>
              <p>
                <strong className="text-white">4. CORS issues?</strong><br />
                Check <code className="bg-dark-700 px-2 py-1 rounded">server/.env</code> has: 
                <code className="bg-dark-700 px-2 py-1 rounded ml-2">CLIENT_URL=http://localhost:3000</code>
              </p>
            </div>
          </div>
        )}

        {/* Documentation Link */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          For detailed troubleshooting, see <code className="bg-dark-700 px-2 py-1 rounded">API_CONNECTION_FIX.md</code>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
