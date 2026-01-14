import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold uppercase tracking-wide text-[#0052FF] mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 border rounded-xl bg-white text-foreground
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:border-[#0052FF]
          disabled:bg-muted disabled:cursor-not-allowed
          placeholder:text-muted-foreground/50
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border hover:border-[#0052FF]/30'}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-2 text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};
