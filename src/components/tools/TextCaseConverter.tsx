import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check, Type, Beaker } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface TextCaseConverterProps {
  onBack: () => void;
}

export const TextCaseConverter: React.FC<TextCaseConverterProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.TEXT_CASE_CONVERTER];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
  };

  const cases = [
    { name: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { name: 'lowercase', fn: (s: string) => s.toLowerCase() },
    {
      name: 'Title Case',
      fn: (s: string) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    },
    {
      name: 'Sentence case',
      fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase())
    },
    {
      name: 'camelCase',
      fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    },
    {
      name: 'PascalCase',
      fn: (s: string) => s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (m, chr) => chr.toUpperCase())
    },
    {
      name: 'snake_case',
      fn: (s: string) => s.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    },
    {
      name: 'kebab-case',
      fn: (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-doc-slate transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-500">Input Text</label>
            <button
              onClick={loadSample}
              className="text-xs font-bold text-doc-red hover:underline flex items-center"
            >
              <Beaker size={14} className="mr-1" /> Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none resize-none"
            placeholder="Type or paste your text here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => {
            const result = input ? c.fn(input) : '';
            return (
              <div key={c.name} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.name}</span>
                  <button
                    onClick={() => handleCopy(result)}
                    disabled={!result}
                    className="text-doc-red opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="text-sm text-slate-700 font-medium truncate">
                  {result || <span className="text-slate-300 italic">No input</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
