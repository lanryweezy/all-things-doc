import React, { useState } from 'react';
import { FileCode, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';

interface HtmlToMarkdownProps {
  onBack: () => void;
}

export const HtmlToMarkdown: React.FC<HtmlToMarkdownProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleConvert = async () => {
    try {
      const TurndownService = (await import('turndown')).default;
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });
      const markdown = turndownService.turndown(input);
      setOutput(markdown);
      showToast('HTML converted to Markdown');
    } catch (err) {
      showToast('Error converting HTML', 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Markdown copied');
  };

  return (
    <ToolLayout toolId={ToolID.HTML_TO_MARKDOWN} onBack={onBack} maxWidth="6xl">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">Input HTML</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-cyan-500/10 outline-none resize-none font-mono text-sm text-slate-700 dark:text-slate-300 transition-all"
            placeholder="<h1>Hello</h1><p>World</p>"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex justify-between items-center transition-colors">
            <span>Markdown Output</span>
            {output && (
              <button onClick={handleCopy} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 text-xs flex items-center font-semibold transition-colors">
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </label>
          <textarea
            readOnly
            value={output}
            className="flex-grow w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none resize-none font-mono text-sm text-slate-500 dark:text-slate-400 transition-colors"
            placeholder="Markdown will appear here..."
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center flex-shrink-0">
        <Button onClick={handleConvert} disabled={!input.trim()} className="bg-cyan-600 hover:bg-cyan-700 px-12 transition-colors" icon={<ArrowRightLeft size={18} />}>
          Convert to Markdown
        </Button>
      </div>
    </ToolLayout>
  );
};
