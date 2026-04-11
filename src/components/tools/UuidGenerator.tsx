import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface UuidGeneratorProps {
  onBack: () => void;
}

export const UuidGenerator: React.FC<UuidGeneratorProps> = ({ onBack }) => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const toolInfo = TOOLS[ToolID.UUID_GENERATOR];

  const generateUuidV4 = () => {
    if (typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUuids = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = generateUuidV4();
      if (!hyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      newUuids.push(uuid);
    }
    setUuids(newUuids);
    setCopiedAll(false);
  };

  // Generate on initial load
  React.useEffect(() => {
    generateUuids();
  }, [count, hyphens, uppercase]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-doc-slate transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-3 rounded-xl ${toolInfo?.bgColor || 'bg-indigo-100'}`}>
            {toolInfo?.icon ? (
              <toolInfo.icon className={`w-8 h-8 ${toolInfo.color || 'text-indigo-600'}`} />
            ) : (
              <Hash className="w-8 h-8 text-indigo-600" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-doc-slate">UUID Generator</h1>
            <p className="text-slate-600">Generate Version 4 UUIDs instantly.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-doc-slate mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity: {count}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Hyphens</label>
                <div 
                  onClick={() => setHyphens(!hyphens)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${hyphens ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${hyphens ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Uppercase</label>
                <div 
                  onClick={() => setUppercase(!uppercase)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${uppercase ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${uppercase ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <Button 
                onClick={generateUuids}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                icon={<RefreshCw size={18} />}
              >
                Regenerate
              </Button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-doc-slate">Generated UUIDs</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllToClipboard}
                icon={copiedAll ? <Check size={16} /> : <Copy size={16} />}
                className={copiedAll ? 'text-green-600 border-green-200 bg-green-50' : ''}
              >
                {copiedAll ? 'Copied All' : 'Copy All'}
              </Button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {uuids.map((uuid, index) => (
                <div 
                  key={index}
                  className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                >
                  <code className="font-mono text-slate-700 text-lg break-all">{uuid}</code>
                  <button
                    onClick={() => copyToClipboard(uuid, index)}
                    className={`p-2 rounded-lg transition-colors ml-2 ${
                      copiedIndex === index 
                        ? 'bg-green-100 text-green-600' 
                        : 'text-slate-400 hover:text-indigo-600 hover:bg-white'
                    }`}
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
