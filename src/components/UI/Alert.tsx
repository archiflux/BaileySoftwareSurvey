import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  className = ''
}) => {
  const config = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-900',
      icon: <Info className="w-5 h-5" />
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      titleColor: 'text-green-900',
      icon: <CheckCircle className="w-5 h-5" />
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      titleColor: 'text-yellow-900',
      icon: <AlertCircle className="w-5 h-5" />
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      titleColor: 'text-red-900',
      icon: <XCircle className="w-5 h-5" />
    }
  };

  const { bgColor, borderColor, textColor, titleColor, icon } = config[type];

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
