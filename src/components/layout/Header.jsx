import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import CurrencySelector from '../common/CurrencySelector';

const Header = ({ onMenuClick }) => {
  const { mode, setMode } = useFinance();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-30 backdrop-blur-lg bg-opacity-95">
      <div className="flex items-center justify-between px-4 lg:px-6 h-20">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden lg:block hover:bg-dark-700 rounded-lg p-2 transition-colors text-left"
          >
            <h2 className="text-xl font-bold text-white">
              Welcome back! 👋
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Here's your financial overview
            </p>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2 bg-dark-700 rounded-xl p-1 border border-dark-600">
            <button
              onClick={() => setMode('personal')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                mode === 'personal'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setMode('business')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                mode === 'business'
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Business
            </button>
          </div>

          {/* Currency Selector */}
          <CurrencySelector compact />

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-dark-700 transition-all duration-300">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full animate-pulse"></span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-700 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-semibold">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-gray-400 text-xs">{currentUser?.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-dark-800 border border-dark-600 rounded-xl shadow-card-hover z-50 overflow-hidden">
                  <div className="p-4 border-b border-dark-600">
                    <p className="text-white font-semibold">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{currentUser?.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/dashboard/settings');
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-dark-700 transition-colors"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-danger-400 hover:bg-danger-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
