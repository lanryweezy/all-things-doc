import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 transition-colors">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 max-w-lg w-full text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              An unexpected error occurred. Don't worry, your data is safe (we don't store it
              anyway).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition-colors"
                icon={<RefreshCw size={18} />}
              >
                Retry Page
              </Button>
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1 transition-colors"
                icon={<Home size={18} />}
              >
                Go Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-8 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-left text-xs text-slate-400 overflow-auto max-h-40 font-mono">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.children;
  }
}
