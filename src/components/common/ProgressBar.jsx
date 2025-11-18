import React from 'react';

const ProgressBar = ({ 
  value, 
  max = 100, 
  color = 'primary',
  size = 'md',
  showLabel = false,
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full ${colors[color]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
