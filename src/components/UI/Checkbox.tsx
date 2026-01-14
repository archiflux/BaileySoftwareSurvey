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
    <div className="flex items-center">
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          className={`
            w-5 h-5 text-[#0052FF] bg-white border-border rounded-md
            focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            accent-[#0052FF]
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
          className="ml-3 text-sm text-foreground cursor-pointer select-none"
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
