import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

interface AppWithErrorBoundaryProps {
  children: React.ReactNode;
}

const AppWithErrorBoundary: React.FC<AppWithErrorBoundaryProps> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default AppWithErrorBoundary;
