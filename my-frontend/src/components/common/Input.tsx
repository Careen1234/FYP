import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;