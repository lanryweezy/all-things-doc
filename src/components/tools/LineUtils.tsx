import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, AlignLeft, Copy, Check, SortAsc, SortDesc, Trash2, Repeat } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface LineUtilsProps {
  onBack: () => void;
}

export const LineUtils: React.FC<LineUtilsProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.LINE_UTILS];

  const handleSortAsc = () => {
    const lines = input.split('\n');
    setInput(lines.sort((a, b) => a.localeCompare(b)).join('\n'));
  };

  const handleSortDesc = () => {
    const lines = input.split('\n');
    setInput(lines.sort((a, b) => b.localeCompare(a)).join('\n'));
  };

  const handleRemoveDuplicates = () => {
    const lines = input.split('\n');
    setInput([...new Set(lines)].join('\n'));
  };

  const handleReverse = () => {
    const lines = input.split('\n');
    setInput(lines.reverse().join('\n'));
  };

  const handleRemoveEmpty = () => {
    const lines = input.split('\n');
    setInput(lines.filter(line => line.trim() !== '').join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    showToast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button onClick={handleSortAsc} variant="outline" size="sm" icon={<SortAsc size={16} />}>
            Sort A-Z
          </Button>
          <Button onClick={handleSortDesc} variant="outline" size="sm" icon={<SortDesc size={16} />}>
            Sort Z-A
          </Button>
          <Button onClick={handleRemoveDuplicates} variant="outline" size="sm" icon={<Trash2 size={16} />}>
            Unique
          </Button>
          <Button onClick={handleReverse} variant="outline" size="sm" icon={<Repeat size={16} />}>
            Reverse
          </Button>
          <Button onClick={handleRemoveEmpty} variant="outline" size="sm">
            Clean Empty
          </Button>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Paste your list or lines of text here..."
          />
          <div className="absolute right-4 bottom-4">
            <Button
              onClick={handleCopy}
              disabled={!input}
              className="bg-slate-900"
              icon={copied ? <Check size={18} /> : <Copy size={18} />}
            >
              {copied ? 'Copied' : 'Copy Result'}
            </Button>
          </div>
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-medium px-2">
          <span>Lines: {input.split('\n').filter(Boolean).length}</span>
          <span>Characters: {input.length}</span>
        </div>
      </div>
    </div>
  );
};
