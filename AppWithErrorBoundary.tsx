import React from 'react';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;