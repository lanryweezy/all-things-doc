import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { DarkModeToggle } from './components/DarkModeToggle';
import { SeoHelmet } from './components/SeoHelmet';
import { analytics } from './services/analytics';
import { checkBackendHealth } from './services/apiCheck';

const App: React.FC = () => {
  const location = useLocation();

  // Initialize backend health check and track page views
  React.useEffect(() => {
    checkBackendHealth();

    const path = location.pathname;
    if (path === '/') {
      analytics.trackPageView('home');
    } else {
      analytics.trackPageView(path.replace('/', ''));
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <SeoHelmet />
      <DarkModeToggle />
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-6 text-center text-sm transition-colors">
        <p>&copy; {new Date().getFullYear()} All Things Doc.</p>
        <div className="mt-2 text-xs text-slate-600 flex justify-center space-x-4">
          <a
            href="/privacy-policy"
            className="hover:text-white dark:hover:text-slate-200 transition-colors"
          >
            Privacy Policy
          </a>
          <a href="/terms-of-use" className="hover:text-white transition-colors">
            Terms of Use
          </a>
          <a href="/sitemap" className="hover:text-white transition-colors">
            Sitemap
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
