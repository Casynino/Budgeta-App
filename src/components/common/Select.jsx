import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  disabled = false,
  placeholder = 'Select an option',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          bg-dark-700 border-dark-600 text-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-dark-800 disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
      >
        <option value="" className="bg-dark-700 text-gray-400">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-dark-700 text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Select;
