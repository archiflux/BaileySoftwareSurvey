import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          className={`
            w-4 h-4 text-primary bg-white border-gray-300 rounded
            focus:ring-2 focus:ring-primary focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />
      </div>
      {label && (
        <label
          htmlFor={checkboxId}
          className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      {error && (
        <p id={`${checkboxId}-error`} className="ml-6 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
