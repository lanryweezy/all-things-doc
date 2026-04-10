import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface Base64ToolProps {
  onBack: () => void;
}

export const Base64Tool: React.FC<Base64ToolProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.BASE64_ENCODER];

  const handleEncode = () => {
    setError(null);
    try {
      const bytes = new TextEncoder().encode(input);
      const binString = String.fromCodePoint(...bytes);
      setOutput(btoa(binString));
    } catch (err) {
      setError('Encoding failed.');
    }
  };

  const handleDecode = () => {
    setError(null);
    try {
      const binString = atob(input);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      setOutput(new TextDecoder().decode(bytes));
    } catch (err) {
      setError('Decoding failed: Invalid Base64 string.');
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
            Input Text
          </label>
          <textarea
            className={`flex-grow w-full p-4 bg-white border rounded-xl focus:ring-2 outline-none font-mono text-xs md:text-sm resize-none ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-doc-red'}`}
            placeholder="Enter text or base64 here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleEncode();
              }
            }}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-doc-slate mb-2 flex justify-between items-center">
            <span>Result</span>
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
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4 flex-shrink-0">
        <Button
          onClick={handleEncode}
          className="bg-doc-slate hover:bg-slate-800 min-w-[150px]"
          icon={<ArrowRightLeft size={18} />}
        >
          Encode
        </Button>
        <Button
          onClick={handleDecode}
          variant="outline"
          className="min-w-[150px]"
          icon={<ArrowRightLeft size={18} />}
        >
          Decode
        </Button>
      </div>
    </div>
  );
};
