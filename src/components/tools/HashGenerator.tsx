import React, { useState } from 'react';
import { Hash, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';

export const HashGenerator: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const generate = async () => {
    if (!input) return;
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setResult(hashHex);
    showToast(`${algo} Generated`);
  };

  return (
    <ToolLayout toolId={ToolID.HASH_GENERATOR} onBack={onBack}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-8 transition-colors">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-medium text-slate-700 dark:text-slate-300 transition-all"
          placeholder="Enter text to hash..."
        />
        <div className="flex flex-wrap justify-center gap-4">
           <select
             value={algo}
             onChange={(e) => setAlgo(e.target.value)}
             className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
           >
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
           </select>
           <Button onClick={generate} className="bg-cyan-700 hover:bg-cyan-800 px-12 transition-colors" icon={<RefreshCw size={18} />}>
             Generate Hash
           </Button>
        </div>

        {result && (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{algo} Result</h3>
                <button
                  onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); showToast('Hash copied'); }}
                  className="text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center transition-colors"
                >
                   {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                   COPY
                </button>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl font-mono text-sm break-all text-slate-700 dark:text-slate-300 transition-colors">
                {result}
             </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
