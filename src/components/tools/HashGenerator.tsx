import React, { useState } from 'react';
import { ArrowLeft, Hash, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface HashGeneratorProps {
  onBack: () => void;
}

export const HashGenerator: React.FC<HashGeneratorProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [algo, setAlgo] = useState('SHA-256');
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.HASH_GENERATOR] || {
    title: 'Text Hash Generator',
    icon: Hash,
    color: 'text-red-600',
    bgColor: 'bg-cyan-100',
  };

  const handleGenerate = async () => {
    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setOutput(hashHex);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('Hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SeoHelmet tool={toolInfo} />
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Input Text</label>
          <textarea
            className="w-full h-32 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none font-mono text-sm"
            placeholder="Enter text to hash..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-t border-slate-100 pt-6">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-slate-900 mb-2">Algorithm</label>
            <select
              value={algo}
              onChange={e => setAlgo(e.target.value)}
              className="w-full md:w-64 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
            >
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!input.trim()}
            className="bg-slate-900 hover:bg-slate-800"
            icon={<Hash size={18} />}
          >
            Generate Hash
          </Button>
        </div>

        {output && (
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 relative group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {algo} Hash
                </span>
                <button
                  onClick={handleCopy}
                  className="text-cyan-600 hover:text-cyan-700 text-xs flex items-center font-semibold"
                >
                  {copied ? (
                    <Check size={14} className="mr-1" />
                  ) : (
                    <Copy size={14} className="mr-1" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-sm break-all text-slate-700">{output}</div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Hash className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Related Tool
                  </p>
                  <p className="text-sm text-indigo-700 font-medium">
                    Need to hash a file instead of text?
                  </p>
                </div>
              </div>
              <button
                onClick={() => (window.location.href = '/tools/file-hasher')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <LinkIcon size={14} className="mr-1.5" /> Try File Checksum
              </button>
            </div>
          </div>
        )}
      </div>
      <AboutTool toolId={ToolID.HASH_GENERATOR} />
    </div>
  );
};
