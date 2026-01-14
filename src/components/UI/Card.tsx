import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'lg'
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 md:p-10'
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-border/50 transition-shadow duration-300 hover:shadow-xl ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
