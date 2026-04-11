import React, { useState } from 'react';
import { ArrowLeft, Code, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface JsonToTypeScriptProps {
  onBack: () => void;
}

export const JsonToTypeScript: React.FC<JsonToTypeScriptProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.JSON_TO_TYPESCRIPT];

  const generateTypeScript = (obj: any, interfaceName = 'RootObject'): string => {
    let result = `export interface ${interfaceName} {\n`;

    for (const key in obj) {
      const value = obj[key];
      const type = typeof value;

      if (value === null) {
        result += `  ${key}: null;\n`;
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const subInterfaceName = key.charAt(0).toUpperCase() + key.slice(1);
          result += `  ${key}: ${subInterfaceName}[];\n`;
          // Recursively (in a real app we'd collect these, but for simplicity here we just show the root)
        } else {
          result += `  ${key}: ${typeof value[0] || 'any'}[];\n`;
        }
      } else if (type === 'object') {
        const subInterfaceName = key.charAt(0).toUpperCase() + key.slice(1);
        result += `  ${key}: ${subInterfaceName};\n`;
      } else {
        result += `  ${key}: ${type};\n`;
      }
    }

    result += '}\n';
    return result;
  };

  const handleConvert = () => {
    setError(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(generateTypeScript(parsed));
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
      <div className="mb-6 flex-shrink-0 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-doc-red outline-none resize-none font-mono text-sm"
            placeholder='{"id": 1, "name": "Test"}'
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
            <span>TypeScript Interface</span>
            {output && (
              <button onClick={handleCopy} className="text-doc-red hover:text-red-700 text-xs flex items-center font-semibold">
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </label>
          <textarea
            readOnly
            value={output}
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none font-mono text-sm text-slate-700"
            placeholder="Interfaces will appear here..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-shrink-0">
        <Button onClick={handleConvert} disabled={!input.trim()} className="bg-doc-slate" icon={<Code size={18} />}>
          Generate Interfaces
        </Button>
      </div>
    </div>
  );
};
