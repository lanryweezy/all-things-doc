import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Button } from './Button';

interface ResultDisplayProps {
  title: string;
  content: string;
  isCode?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, content, isCode = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in mt-8">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">{title}</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCopy} 
            className="!py-1.5 !px-3 !text-xs h-8"
            icon={copied ? <Check size={14} /> : <Copy size={14} />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownload}
            className="!py-1.5 !px-3 !text-xs h-8"
            icon={<Download size={14} />}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="p-0">
        <pre className={`w-full p-6 overflow-x-auto text-sm leading-relaxed ${isCode ? 'bg-slate-900 text-slate-100 font-mono' : 'bg-white text-slate-700 font-sans whitespace-pre-wrap'}`}>
          {content}
        </pre>
      </div>
    </div>
  );
};