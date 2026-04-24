import React, { useState, useEffect } from 'react';
import { Layers, Download } from 'lucide-react';
import { ToolID } from '../types';
import { TOOLS } from '../constants';

interface HeaderProps {
  goHome: () => void;
  activeTool: ToolID | null;
}

export const Header: React.FC<HeaderProps> = ({ goHome, activeTool }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
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
        <div onClick={goHome} className="flex items-center space-x-2 cursor-pointer group">
          <div className="bg-doc-red text-white p-1.5 rounded-lg group-hover:opacity-90 transition-opacity">
            <Layers size={24} />
          </div>
          <span className="text-xl font-bold text-doc-slate dark:text-white tracking-tight transition-colors">
            All Things <span className="text-doc-red">Doc</span>
          </span>
        </div>

        <nav className="flex items-center space-x-4">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-doc-red text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
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
              <span className="font-semibold text-doc-red">{TOOLS[activeTool].title}</span>
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
