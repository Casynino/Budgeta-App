import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const MobileTest = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, status, message) => {
    setResults(prev => [...prev, { test, status, message, time: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setResults([]);
    setTesting(true);

    // Test 1: Check API URL
    addResult('API URL Detection', 'info', `Using: ${import.meta.env.VITE_API_URL || 'auto-detected'}`);
    addResult('Hostname', 'info', window.location.hostname);
    
    // Determine API URL (same logic as api.js)
    const hostname = window.location.hostname;
    const isProduction = hostname.includes('vercel.app') || 
                         (hostname !== 'localhost' && hostname !== '127.0.0.1');
    
    const API_URL = isProduction 
      ? 'https://budgeta-app-vaxu.onrender.com/api'
      : 'http://localhost:5001/api';
    
    addResult('Final API URL', 'success', API_URL);

    // Test 2: Backend Health Check
    try {
      const healthUrl = API_URL.replace('/api', '/health');
      addResult('Health Check', 'info', `Testing: ${healthUrl}`);
      
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        addResult('Health Check', 'success', `✅ Backend is running: ${data.message}`);
      } else {
        addResult('Health Check', 'error', `❌ Status: ${healthResponse.status}`);
      }
    } catch (error) {
      addResult('Health Check', 'error', `❌ ${error.message}`);
    }

    // Test 3: CORS Preflight
    try {
      addResult('CORS Test', 'info', 'Testing CORS...');
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'OPTIONS',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type',
        },
      });
      
      if (response.ok || response.status === 204) {
        addResult('CORS Test', 'success', '✅ CORS preflight successful');
      } else {
        addResult('CORS Test', 'error', `❌ Status: ${response.status}`);
      }
    } catch (error) {
      addResult('CORS Test', 'error', `❌ ${error.message}`);
    }

    // Test 4: Actual Login Request (expect 401 or 400, not network error)
    try {
      addResult('Login API Test', 'info', 'Testing login endpoint...');
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test123',
        }),
      });
      
      addResult('Login API Test', 'info', `Response status: ${response.status}`);
      
      if (response.status === 401 || response.status === 400) {
        addResult('Login API Test', 'success', '✅ API is reachable (got expected auth error)');
        const data = await response.json();
        addResult('Error Response', 'info', data.error || 'Auth failed as expected');
      } else if (response.ok) {
        addResult('Login API Test', 'success', '✅ Got response from API');
      } else {
        addResult('Login API Test', 'error', `❌ Unexpected status: ${response.status}`);
      }
    } catch (error) {
      addResult('Login API Test', 'error', `❌ NETWORK ERROR: ${error.message}`);
      addResult('Error Details', 'error', error.toString());
    }

    // Test 5: Browser Info
    addResult('Browser', 'info', navigator.userAgent);
    addResult('Online Status', 'info', navigator.onLine ? 'Online' : 'Offline');
    
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <Activity className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Mobile Connectivity Test</h1>
          <p className="text-gray-400">Diagnose connection issues</p>
        </div>

        {/* Run Test Button */}
        <button
          onClick={runTests}
          disabled={testing}
          className="w-full mb-6 px-6 py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white rounded-xl font-semibold transition-colors text-lg"
        >
          {testing ? 'Running Tests...' : 'Run Diagnostic Tests'}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  result.status === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : result.status === 'error'
                    ? 'bg-red-500/10 border-red-500/50 text-red-400'
                    : 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                }`}
              >
                <div className="font-semibold mb-1">{result.test}</div>
                <div className="text-sm break-words">{result.message}</div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {results.length === 0 && (
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 text-gray-300">
            <h3 className="font-semibold text-white mb-3">How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Run Diagnostic Tests" button above</li>
              <li>Wait for all tests to complete</li>
              <li>Screenshot the results</li>
              <li>Share with support for diagnosis</li>
            </ol>
            
            <div className="mt-4 pt-4 border-t border-dark-600">
              <p className="text-xs text-gray-500">
                This page tests connectivity between your device and the backend server.
                It will help identify where the connection is failing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTest;
