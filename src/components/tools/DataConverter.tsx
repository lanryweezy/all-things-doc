import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, Beaker } from 'lucide-react';
import { Button } from '../ui/Button';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';

interface DataConverterProps {
  toolId: ToolID.JSON_TO_CSV | ToolID.CSV_TO_JSON | ToolID.XML_TO_JSON | ToolID.JSON_TO_XML | ToolID.YAML_TO_JSON | ToolID.JSON_TO_YAML;
  onBack: () => void;
}

export const DataConverter: React.FC<DataConverterProps> = ({ toolId, onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, [toolId]);

  const getInputLabel = () => toolId.split('_')[0].toUpperCase();
  const getOutputLabel = () => toolId.split('_')[2].toUpperCase();

  const handleConvert = async () => {
    setError(null);
    if (!input.trim()) return;
    try {
       // Shared logic for simulation/mock - in real app would use specific libs
       setOutput(`// Converted ${getInputLabel()} to ${getOutputLabel()}\n${input.substring(0, 100)}...`);
    } catch (err) {
      setError(`Conversion Failed: ${(err as Error).message}`);
    }
  };

  return (
    <ToolLayout toolId={toolId} onBack={onBack} maxWidth="6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[500px]">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 transition-colors px-1">
            Input {getInputLabel()}
          </label>
          <textarea
            className={`flex-grow w-full p-6 bg-white dark:bg-slate-900 border rounded-3xl focus:ring-4 focus:ring-cyan-500/10 outline-none font-mono text-sm resize-none transition-all ${error ? 'border-red-300 dark:border-red-900' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 text-slate-700 dark:text-slate-300'}`}
            placeholder={`Paste your ${getInputLabel()} here...`}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 transition-colors">
              Output {getOutputLabel()}
            </label>
            {output && (
              <button
                onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="text-cyan-600 dark:text-cyan-400 hover:underline text-[10px] font-black uppercase tracking-widest transition-colors flex items-center"
              >
                {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                {copied ? 'Copied' : 'Copy Result'}
              </button>
            )}
          </div>
          <textarea
            readOnly
            className="flex-grow w-full p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none font-mono text-sm resize-none text-slate-500 dark:text-slate-400 transition-colors"
            value={output}
            placeholder="Conversion will appear here..."
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={handleConvert} className="bg-cyan-600 hover:bg-cyan-700 sm:min-w-[200px]" icon={<ArrowRightLeft size={18} />}>
          Convert Now
        </Button>
        <Button onClick={() => setInput('{"sample": "data"}')} variant="outline" className="sm:min-w-[150px]" icon={<Beaker size={18} />}>
          Load Sample
        </Button>
      </div>
    </ToolLayout>
  );
};
