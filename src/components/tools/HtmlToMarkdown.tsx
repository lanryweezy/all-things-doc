import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Code, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface HtmlToMarkdownProps {
  onBack: () => void;
}

export const HtmlToMarkdown: React.FC<HtmlToMarkdownProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.HTML_TO_MARKDOWN];

  const handleConvert = async () => {
    try {
      const TurndownService = (await import('turndown')).default;
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });
      const markdown = turndownService.turndown(input);
      setOutput(markdown);
    } catch (err) {
      showToast('Error converting HTML to Markdown', 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Input HTML</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none font-mono text-sm"
            placeholder="<h1>Hello</h1><p>World</p>"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
            <span>Markdown Output</span>
            {output && (
              <button onClick={handleCopy} className="text-red-600 hover:text-cyan-700 text-xs flex items-center font-semibold">
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </label>
          <textarea
            readOnly
            value={output}
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none font-mono text-sm text-slate-700"
            placeholder="Markdown will appear here..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-shrink-0">
        <Button onClick={handleConvert} disabled={!input.trim()} className="bg-doc-slate" icon={<ArrowRightLeft size={18} />}>
          Convert to Markdown
        </Button>
      </div>
    </div>
  );
};
