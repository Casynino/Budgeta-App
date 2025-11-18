import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const BackToHome = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/dashboard')}
      className={`fixed bottom-8 right-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full
        bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg hover:shadow-xl
        transform hover:scale-105 transition-all duration-300 ${className}`}
      title="Back to Home"
    >
      <Home className="w-5 h-5" />
      <span className="font-medium hidden sm:inline">Home</span>
    </button>
  );
};

export default BackToHome;
