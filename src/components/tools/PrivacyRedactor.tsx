import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface PrivacyRedactorProps {
  onBack: () => void;
}

export const PrivacyRedactor: React.FC<PrivacyRedactorProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.PRIVACY_REDACTOR] || {
    title: 'Privacy Redactor',
    icon: Shield,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  };

  const redactPatterns = [
    { label: 'Emails', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL]' },
    { label: 'Phone Numbers', regex: /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, replacement: '[PHONE]' },
    { label: 'IP Addresses', regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[IP]' },
    { label: 'Credit Cards', regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[CARD]' },
  ];

  const handleRedact = () => {
    let result = input;
    redactPatterns.forEach(({ regex, replacement }) => {
      result = result.replace(regex, replacement);
    });
    setOutput(result);
    showToast('Privacy data redacted');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-8 flex-shrink-0 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
            placeholder="Paste text containing emails, phones, etc..."
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Redacted Text</label>
            {output && (
              <button onClick={handleCopy} className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center">
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            className="flex-grow w-full p-4 bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl font-mono text-sm resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-shrink-0">
        <Button onClick={handleRedact} disabled={!input.trim()} className="bg-indigo-600 px-12 py-4" icon={<RefreshCw size={18} />}>
          Auto Redact PII
        </Button>
      </div>
    </div>
  );
};
