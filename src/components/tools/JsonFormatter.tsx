import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlignLeft, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface JsonFormatterProps {
  onBack: () => void;
}

export const JsonFormatter: React.FC<JsonFormatterProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const toolInfo = TOOLS[ToolID.JSON_FORMATTER];

  const handleFormat = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      // Use a faster way to check if input is already an object or needs parsing
      const parsed = typeof input === 'string' ? JSON.parse(input) : input;
      setOutput(JSON.stringify(parsed, null, indent === 0 ? '\t' : indent));
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
    }
  };

  const handleMinify = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      const parsed = typeof input === 'string' ? JSON.parse(input) : input;
      setOutput(JSON.stringify(parsed));
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
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

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-doc-slate mb-2">
            Input JSON
          </label>
          <textarea
            className={`flex-grow w-full p-4 bg-white border rounded-xl focus:ring-2 outline-none font-mono text-xs md:text-sm resize-none ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-doc-red'}`}
            placeholder='{"key": "value"}'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleFormat();
              }
            }}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-doc-slate mb-2 flex justify-between items-center">
            <span>Formatted Output</span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-doc-red hover:text-red-700 text-xs flex items-center font-semibold"
              >
                {copied ? (
                  <Check size={14} className="mr-1" />
                ) : (
                  <Copy size={14} className="mr-1" />
                )}
                {copied ? 'Copied' : 'Copy Output'}
              </button>
            )}
          </label>
          <textarea
            readOnly
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono text-xs md:text-sm resize-none text-slate-600"
            value={output}
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 flex-shrink-0">
        <div className="flex items-center bg-white border border-slate-300 rounded-xl px-4 py-2">
          <span className="text-sm text-slate-500 mr-2">Indentation:</span>
          <select
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value))}
            className="bg-transparent text-sm font-semibold outline-none"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="0">Tab</option>
          </select>
        </div>
        <Button
          onClick={handleFormat}
          className="bg-doc-slate hover:bg-slate-800 min-w-[150px]"
          icon={<AlignLeft size={18} />}
        >
          Format
        </Button>
        <Button
          onClick={handleMinify}
          variant="outline"
          className="min-w-[150px]"
        >
          Minify
        </Button>
      </div>
    </div>
  );
};
