import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Code, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface StringEscaperProps {
  onBack: () => void;
}

export const StringEscaper: React.FC<StringEscaperProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [type, setType] = useState<'html' | 'json' | 'js'>('html');
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.STRING_ESCAPER] || {
    title: 'String Escaper',
    icon: Code,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  };

  const process = () => {
    try {
      let result = '';
      if (mode === 'escape') {
        if (type === 'html') {
          result = input.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
          }[m] || m));
        } else if (type === 'json' || type === 'js') {
          result = JSON.stringify(input).slice(1, -1);
        }
      } else {
        if (type === 'html') {
          const doc = new DOMParser().parseFromString(input, 'text/html');
          result = doc.documentElement.textContent || '';
        } else if (type === 'json' || type === 'js') {
          result = JSON.parse('"' + input.replace(/"/g, '\\"') + '"');
        }
      }
      setOutput(result);
    } catch (e) {
      showToast('Processing failed. Check input format.', 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showToast('Copied to clipboard');
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex p-1 bg-slate-100 rounded-xl">
             {['escape', 'unescape'].map(m => (
               <button
                 key={m}
                 onClick={() => setMode(m as any)}
                 className={`px-6 py-2 text-sm font-bold rounded-lg capitalize transition-all ${mode === m ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
               >
                 {m}
               </button>
             ))}
          </div>

          <div className="flex space-x-2">
             {['html', 'json', 'js'].map(t => (
               <button
                 key={t}
                 onClick={() => setType(t as any)}
                 className={`px-4 py-2 text-xs font-black uppercase rounded-lg border transition-all ${type === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'}`}
               >
                 {t}
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Input String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
            placeholder="Paste text here..."
          />
        </div>

        <div className="flex justify-center">
           <Button onClick={process} className="bg-slate-900 px-10" icon={<RefreshCw size={18} />}>
             Run {mode}
           </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Output</label>
             {output && (
               <button onClick={handleCopy} className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center">
                  <Copy size={14} className="mr-1" /> COPY
               </button>
             )}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-40 p-4 bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
