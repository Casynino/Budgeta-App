import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/layout/Layout';
import Welcome from './pages/Welcome/Welcome';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import DashboardNew from './pages/Dashboard/DashboardNew';
import Accounts from './pages/Accounts/Accounts';
import AccountDetails from './pages/Accounts/AccountDetails';
import Allocation from './pages/Allocation/Allocation';
import Transactions from './pages/Transactions/Transactions';
import Budget from './pages/Budget/Budget';
import Debts from './pages/Debts/Debts';
import Investments from './pages/Investments/Investments';
import Recurring from './pages/Recurring/Recurring';
import Business from './pages/Business/Business';
import Goals from './pages/Goals/Goals';
import Settings from './pages/Settings/Settings';
import ApiTest from './pages/ApiTest';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/api-test" element={<ApiTest />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardNew />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="accounts/:accountId" element={<AccountDetails />} />
              <Route path="allocation" element={<Allocation />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="budget" element={<Budget />} />
              <Route path="debts" element={<Debts />} />
              <Route path="investments" element={<Investments />} />
              <Route path="recurring" element={<Recurring />} />
              <Route path="business" element={<Business />} />
              <Route path="goals" element={<Goals />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all - redirect to welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
