import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  onClick = null,
  variant = 'default' // default, glass, gradient
}) => {
  const variants = {
    default: 'bg-dark-700 border border-dark-600',
    glass: 'glass-card',
    gradient: 'bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600',
  };
  
  const baseClasses = 'rounded-2xl shadow-card';
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${padding} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
