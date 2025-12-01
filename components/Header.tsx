import React from 'react';
import { Layers } from 'lucide-react';
import { ToolID } from '../types';
import { TOOLS } from '../constants';

interface HeaderProps {
  goHome: () => void;
  activeTool: ToolID | null;
}

export const Header: React.FC<HeaderProps> = ({ goHome, activeTool }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <div 
          onClick={goHome}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="bg-doc-red text-white p-1.5 rounded-lg group-hover:opacity-90 transition-opacity">
            <Layers size={24} />
          </div>
          <span className="text-xl font-bold text-doc-slate tracking-tight">
            All Things <span className="text-doc-red">Doc</span>
          </span>
        </div>

        <nav>
          {activeTool ? (
            <div className="flex items-center space-x-2 text-sm">
               <button 
                onClick={goHome}
                className="text-slate-500 hover:text-doc-slate font-medium"
              >
                Tools
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-doc-red">
                {TOOLS[activeTool].title}
              </span>
            </div>
          ) : (
             <div className="text-sm font-medium text-slate-500">
                The comprehensive file tool suite
             </div>
          )}
        </nav>
      </div>
    </header>
  );
};