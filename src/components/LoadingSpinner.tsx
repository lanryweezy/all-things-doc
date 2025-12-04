import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Processing...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-2 border-slate-200 border-t-doc-red rounded-full animate-spin`}
        ></div>
      </div>
      {message && <p className="mt-3 text-slate-600 text-sm font-medium">{message}</p>}
    </div>
  );
};

export const ProcessingProgress: React.FC<{ progress?: number; message?: string }> = ({
  progress,
  message = 'Processing file...',
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-doc-red rounded-full animate-spin"></div>
          <p className="text-slate-700 font-medium">{message}</p>
        </div>
        {progress !== undefined && (
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-doc-red h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2">This may take a few moments...</p>
      </div>
    </div>
  );
};
