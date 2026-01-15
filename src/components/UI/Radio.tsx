import React from 'react';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center h-5">
        <input
          id={radioId}
          type="radio"
          className={`
            w-5 h-5 text-[#1e6c93] bg-white border-border
            focus:ring-2 focus:ring-[#1e6c93] focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            accent-[#1e6c93]
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${radioId}-error` : undefined}
          {...props}
        />
      </div>
      <label
        htmlFor={radioId}
        className="ml-3 text-sm text-foreground cursor-pointer select-none"
      >
        {label}
      </label>
      {error && (
        <p id={`${radioId}-error`} className="ml-6 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
