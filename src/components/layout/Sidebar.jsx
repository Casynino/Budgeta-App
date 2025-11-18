import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Home,
  ArrowDownUp, 
  Wallet,
  PieChart,
  CreditCard, 
  TrendingUp,
  Receipt,
  Briefcase,
  Target,
  Settings,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home', exact: true },
    { path: '/dashboard/accounts', icon: Wallet, label: 'Accounts' },
    { path: '/dashboard/allocation', icon: PieChart, label: 'Allocation' },
    { path: '/dashboard/transactions', icon: ArrowDownUp, label: 'Transactions' },
    { path: '/dashboard/budget', icon: Wallet, label: 'Budget' },
    { path: '/dashboard/debts', icon: CreditCard, label: 'Debts' },
    { path: '/dashboard/investments', icon: TrendingUp, label: 'Investments' },
    { path: '/dashboard/recurring', icon: Receipt, label: 'Recurring' },
    { path: '/dashboard/business', icon: Briefcase, label: 'Business' },
    { path: '/dashboard/goals', icon: Target, label: 'Goals' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-dark-800 border-r border-dark-700
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <button
          onClick={() => {
            navigate('/dashboard');
            onClose();
          }}
          className="flex items-center justify-center gap-2 h-20 border-b border-dark-700 w-full hover:bg-dark-700 transition-colors"
        >
          <Sparkles className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 via-purple-500 to-primary-400 bg-clip-text text-transparent">
            Budgeta
          </h1>
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white hover:scale-105'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Settings at bottom */}
          <div className="mt-8 pt-6 border-t border-dark-700">
            <NavLink
              to="/dashboard/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg scale-105' 
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white hover:scale-105'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
