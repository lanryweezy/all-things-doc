import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Hash, List, Disc } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface RandomGeneratorProps {
  onBack: () => void;
}

export const RandomGenerator: React.FC<RandomGeneratorProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'number' | 'list' | 'coin'>('number');

  // Number Mode
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');

  // List Mode
  const [list, setList] = useState('');

  const [result, setResult] = useState<string | number | null>(null);
  const { showToast } = useToast();
  const toolInfo = TOOLS[ToolID.RANDOM_GENERATOR];

  const generate = () => {
    if (mode === 'number') {
      const mn = parseInt(min);
      const mx = parseInt(max);
      if (isNaN(mn) || isNaN(mx) || mn >= mx) {
        showToast('Invalid range', 'error');
        return;
      }
      setResult(Math.floor(Math.random() * (mx - mn + 1)) + mn);
    } else if (mode === 'list') {
      const items = list.split('\n').filter(i => i.trim() !== '');
      if (items.length === 0) {
        showToast('List is empty', 'error');
        return;
      }
      setResult(items[Math.floor(Math.random() * items.length)]);
    } else {
      setResult(Math.random() > 0.5 ? 'Heads' : 'Tails');
    }
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[
            { id: 'number', label: 'Number', icon: <Hash size={16} /> },
            { id: 'list', label: 'From List', icon: <List size={16} /> },
            { id: 'coin', label: 'Coin Flip', icon: <Disc size={16} /> },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id as any);
                setResult(null);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-bold transition-all ${
                mode === m.id
                  ? 'bg-slate-50 text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="p-10 space-y-10">
          <div className="min-h-[160px] flex items-center justify-center">
            {result !== null ? (
              <div className="text-center animate-bounce-in">
                <div className="text-8xl font-black text-amber-600">{result}</div>
                <div className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Random Result
                </div>
              </div>
            ) : (
              <div className="text-slate-300 text-lg italic">Ready to generate?</div>
            )}
          </div>

          <div className="max-w-md mx-auto space-y-6">
            {mode === 'number' && (
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Min</label>
                  <input
                    type="number"
                    value={min}
                    onChange={e => setMin(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Max</label>
                  <input
                    type="number"
                    value={max}
                    onChange={e => setMax(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                  />
                </div>
              </div>
            )}

            {mode === 'list' && (
              <textarea
                value={list}
                onChange={e => setList(e.target.value)}
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none resize-none font-medium"
                placeholder="Enter options (one per line)..."
              />
            )}

            <Button
              onClick={generate}
              className="w-full bg-amber-600 py-6 text-lg font-black"
              icon={<RefreshCw size={20} />}
            >
              GENERATE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
