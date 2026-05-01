import React, { useState, useEffect } from 'react';
import { Layers, Download } from 'lucide-react';
import { ToolID, BeforeInstallPromptEvent } from '../types';
import { TOOLS } from '../constants';
import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface HeaderProps {
  goHome: () => void;
  activeTool: ToolID | null;
}

export const Header: React.FC<HeaderProps> = ({ goHome, activeTool }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            goHome();
          }}
          className="flex items-center space-x-2 cursor-pointer group"
          aria-label="All Things Doc Home"
        >
          <div className="bg-cyan-600 text-white p-1.5 rounded-lg group-hover:opacity-90 transition-opacity">
            <Layers size={24} />
          </div>
          <span className="text-xl font-bold text-doc-slate dark:text-white tracking-tight transition-colors">
            All Things <span className="text-cyan-600">Doc</span>
          </span>
        </a>

        <nav className="flex items-center space-x-4">
          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mr-4"
          >
            Pricing
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mr-4"
          >
            Pricing
          </Link>
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700 transition-colors"
            >
              <Download size={14} />
              <span className="hidden xs:inline">Install App</span>
            </button>
          )}
          {activeTool ? (
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={goHome}
                className="text-slate-500 dark:text-slate-400 hover:text-doc-slate dark:hover:text-white font-medium transition-colors"
              >
                Tools
              </button>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="font-semibold text-cyan-600">{TOOLS[activeTool].title}</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hidden sm:block">
              The comprehensive file tool suite
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
