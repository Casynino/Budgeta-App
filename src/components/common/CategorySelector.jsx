import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CategorySelector = ({
  label,
  name,
  value,
  onChange,
  categories = [],
  required = false,
  error = '',
  disabled = false,
  placeholder = 'Select a category',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = categories.find(cat => cat.id === value);

  const handleSelect = (categoryId) => {
    onChange({ target: { name, value: categoryId } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Selected Value Display */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border text-left
            bg-dark-700 border-dark-600 text-white
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-between gap-3
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
        >
          <div className="flex items-center gap-3 flex-1">
            {selectedCategory ? (
              <>
                {/* Color Indicator */}
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white/20"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                {/* Icon */}
                <span className="text-xl flex-shrink-0">{selectedCategory.icon}</span>
                {/* Name */}
                <span className="font-medium">{selectedCategory.name}</span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Options List */}
            <div className="absolute z-50 w-full mt-2 bg-dark-800 border border-dark-600 rounded-xl shadow-card-hover max-h-80 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-center text-sm">
                  No categories available
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category.id)}
                    className={`
                      w-full px-4 py-3 flex items-center gap-3 text-left
                      hover:bg-dark-700 transition-colors
                      ${value === category.id ? 'bg-dark-700' : ''}
                    `}
                  >
                    {/* Color Indicator */}
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white/20"
                      style={{ backgroundColor: category.color }}
                    />
                    {/* Icon */}
                    <span className="text-xl flex-shrink-0">{category.icon}</span>
                    {/* Name */}
                    <span className="text-white font-medium flex-1">{category.name}</span>
                    {/* Checkmark for selected */}
                    {value === category.id && (
                      <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default CategorySelector;
