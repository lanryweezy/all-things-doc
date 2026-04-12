import React, { useState } from 'react';
import { ArrowLeft, Eraser, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface TextCleanerProps {
  onBack: () => void;
}

export const TextCleaner: React.FC<TextCleanerProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    extraSpaces: true,
    emptyLines: true,
    smartQuotes: true,
    trim: true,
  });

  const toolInfo = TOOLS[ToolID.TEXT_CLEANER];

  const handleClean = () => {
    let result = input;

    if (options.extraSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
    }
    if (options.emptyLines) {
      result = result.replace(/\n\s*\n/g, '\n');
    }
    if (options.smartQuotes) {
      result = result
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');
    }
    if (options.trim) {
      result = result.split('\n').map(line => line.trim()).join('\n').trim();
    }

    setInput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          {[
            { id: 'extraSpaces', label: 'Extra Spaces' },
            { id: 'emptyLines', label: 'Empty Lines' },
            { id: 'smartQuotes', label: 'Smart Quotes' },
            { id: 'trim', label: 'Trim Lines' },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center space-x-2 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={(options as any)[opt.id]}
                onChange={() => setOptions({ ...options, [opt.id]: !(options as any)[opt.id] })}
                className="w-4 h-4 rounded border-slate-300 text-doc-red focus:ring-doc-red cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{opt.label}</span>
            </label>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none resize-none leading-relaxed font-mono text-sm"
            placeholder="Paste messy text here to clean it up..."
          />
          <div className="absolute right-4 bottom-4 flex space-x-2">
            <button
              onClick={handleCopy}
              disabled={!input}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-doc-red shadow-sm transition-colors disabled:opacity-30"
              title="Copy result"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <Button
              onClick={handleClean}
              disabled={!input.trim()}
              className="bg-doc-slate"
              icon={<Eraser size={18} />}
            >
              Clean Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
