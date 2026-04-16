import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Copy, Check, Eye, Code } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownToolProps {
  onBack: () => void;
}

export const MarkdownTool: React.FC<MarkdownToolProps> = ({ onBack }) => {
  const [input, setInput] = useState('# Hello Markdown\n\nEdit this text to see the preview.\n\n- Lists\n- **Bold**\n- [Links](https://google.com)');
  const [view, setView] = useState<'edit' | 'preview' | 'split'>('split');
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.MARKDOWN_TOOL];

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-5 h-5 ${toolInfo.color}`} />
          </div>
          <h1 className="text-2xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setView('edit')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'edit' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}
          >
            <Code size={16} className="inline mr-1" /> Edit
          </button>
          <button
            onClick={() => setView('split')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all hidden md:block ${view === 'split' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}
          >
            Split
          </button>
          <button
            onClick={() => setView('preview')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'preview' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}
          >
            <Eye size={16} className="inline mr-1" /> Preview
          </button>
        </div>
      </div>

      <div className="flex-grow flex gap-4 min-h-0">
        {(view === 'edit' || (view === 'split' && window.innerWidth > 768)) && (
          <div className="flex-1 flex flex-col min-w-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm resize-none focus:ring-2 focus:ring-cyan-600 outline-none"
              placeholder="Type markdown here..."
            />
          </div>
        )}

        {(view === 'preview' || view === 'split') && (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-grow w-full p-8 bg-white border border-slate-200 rounded-2xl overflow-y-auto prose prose-slate max-w-none prose-headings:text-doc-slate prose-a:text-cyan-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex-shrink-0 flex justify-center space-x-4">
        <Button onClick={handleCopy} variant="outline" icon={copied ? <Check size={18} /> : <Copy size={18} />}>
          {copied ? 'Copied!' : 'Copy Markdown'}
        </Button>
        <Button onClick={handleDownload} className="bg-doc-slate" icon={<Download size={18} />}>
          Download .md
        </Button>
      </div>
    </div>
  );
};
