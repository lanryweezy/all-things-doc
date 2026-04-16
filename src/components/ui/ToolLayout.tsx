import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ToolID } from '../../types';
import { TOOLS } from '../../constants';
import { SeoHelmet } from '../SeoHelmet';
import { AboutTool } from './AboutTool';

interface ToolLayoutProps {
  toolId: ToolID;
  onBack: () => void;
  children: React.ReactNode;
  maxWidth?: '4xl' | '6xl' | '3xl';
  actions?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  toolId,
  onBack,
  children,
  maxWidth = '4xl',
  actions
}) => {
  const toolInfo = TOOLS[toolId];
  if (!toolInfo) return <>{children}</>;

  const maxWidthClass = {
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
  }[maxWidth];

  return (
    <div className={`${maxWidthClass} mx-auto px-1 sm:px-0`}>
      <SeoHelmet tool={toolInfo} />

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-500 dark:text-slate-400 active:scale-95"
            aria-label="Back to tools"
          >
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2.5 rounded-2xl ${toolInfo.bgColor} shadow-sm transition-colors`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white transition-colors tracking-tight">{toolInfo.title}</h1>
        </div>
        {actions && <div className="flex items-center space-x-2 w-full md:w-auto">{actions}</div>}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>

      <AboutTool toolId={toolId} />
    </div>
  );
};
