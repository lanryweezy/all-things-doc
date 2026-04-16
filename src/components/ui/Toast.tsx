import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-2 duration-300 transition-colors
              ${
                toast.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100'
                  : toast.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/90 border-red-100 dark:border-red-800 text-red-800 dark:text-red-100'
                  : 'bg-cyan-50 dark:bg-cyan-900/90 border-cyan-100 dark:border-cyan-800 text-cyan-800 dark:text-cyan-100'
              }
            `}
          >
            {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-500 dark:text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-red-500 dark:text-red-400" />}
            {toast.type === 'info' && <Info size={18} className="text-cyan-500 dark:text-cyan-400" />}
            <span className="text-sm font-bold uppercase tracking-tight">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
