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
  actions,
}) => {
  const toolInfo = TOOLS[toolId];
  if (!toolInfo) return <>{children}</>;

  const maxWidthClass = {
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
  }[maxWidth];

  return (
    <div className={`${maxWidthClass} mx-auto`}>
      <SeoHelmet tool={toolInfo} />

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
            aria-label="Back to tools"
          >
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate dark:text-white transition-colors">
            {toolInfo.title}
          </h1>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {children}

      <AboutTool toolId={toolId} />
    </div>
  );
};
