import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  icon = null,
  className = ''
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-dark-600 text-white border border-dark-500 hover:bg-dark-500 hover:shadow-xl active:scale-95 disabled:opacity-50',
    success: 'bg-success-500 text-white hover:bg-success-600 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50',
    purple: 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-xl active:scale-95 disabled:opacity-50',
    ghost: 'text-gray-400 hover:text-white hover:bg-dark-600 active:scale-95 disabled:opacity-50',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
