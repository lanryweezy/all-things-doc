import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Link, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface UrlEncoderProps {
  onBack: () => void;
}

export const UrlEncoder: React.FC<UrlEncoderProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.URL_ENCODER];

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setOutput('Error: Invalid input');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput('Error: Malformed URI');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
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
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none font-mono text-sm"
            placeholder="Paste URL or text to encode/decode..."
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={handleEncode} className="bg-cyan-600 px-8" icon={<RefreshCw size={18} />}>
            Encode
          </Button>
          <Button onClick={handleDecode} variant="outline" className="px-8">
            Decode
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider">Output</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-red-600 hover:text-cyan-700 text-xs flex items-center font-bold"
              >
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-40 p-4 bg-white border border-slate-200 rounded-xl font-mono text-sm resize-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
