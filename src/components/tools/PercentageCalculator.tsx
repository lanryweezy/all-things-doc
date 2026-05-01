import React, { useState, useEffect } from 'react';
import { ArrowLeft, Hash, Percent, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface PercentageCalculatorProps {
  onBack: () => void;
}

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ onBack }) => {
  // Scenario 1: What is X% of Y?
  const [s1X, setS1X] = useState('10');
  const [s1Y, setS1Y] = useState('100');
  const [s1Result, setS1Result] = useState<string>('10');

  // Scenario 2: X is what % of Y?
  const [s2X, setS2X] = useState('20');
  const [s2Y, setS2Y] = useState('200');
  const [s2Result, setS2Result] = useState<string>('10');

  // Scenario 3: Percentage Increase/Decrease
  const [s3From, setS3From] = useState('100');
  const [s3To, setS3To] = useState('120');
  const [s3Result, setS3Result] = useState<string>('20');

  const { showToast } = useToast();
  const toolInfo = TOOLS[ToolID.PERCENTAGE_CALCULATOR];

  useEffect(() => {
    // S1 Calculation
    const x1 = parseFloat(s1X);
    const y1 = parseFloat(s1Y);
    if (!isNaN(x1) && !isNaN(y1)) {
      setS1Result(((x1 / 100) * y1).toFixed(2).replace(/\.00$/, ''));
    }

    // S2 Calculation
    const x2 = parseFloat(s2X);
    const y2 = parseFloat(s2Y);
    if (!isNaN(x2) && !isNaN(y2) && y2 !== 0) {
      setS2Result(((x2 / y2) * 100).toFixed(2).replace(/\.00$/, ''));
    }

    // S3 Calculation
    const from = parseFloat(s3From);
    const to = parseFloat(s3To);
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      setS3Result((((to - from) / from) * 100).toFixed(2).replace(/\.00$/, ''));
    }
  }, [s1X, s1Y, s2X, s2Y, s3From, s3To]);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    showToast('Result copied');
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

      <div className="grid grid-cols-1 gap-6">
        {/* Scenario 1 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-400">
            <Percent size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Find Percentage</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xl font-bold text-slate-900">
            <span>What is</span>
            <input
              type="number"
              value={s1X}
              onChange={e => setS1X(e.target.value)}
              className="w-24 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none text-center"
            />
            <span>% of</span>
            <input
              type="number"
              value={s1Y}
              onChange={e => setS1Y(e.target.value)}
              className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none text-center"
            />
            <span>?</span>
          </div>
          <div
            onClick={() => handleCopy(s1Result)}
            className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100 flex justify-between items-center cursor-pointer hover:bg-cyan-100 transition-colors group"
          >
            <span className="text-red-400 font-bold uppercase tracking-wider">Result</span>
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-black text-cyan-600">{s1Result}</span>
              <div className="text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to copy
              </div>
            </div>
          </div>
        </div>

        {/* Scenario 2 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-400">
            <Hash size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Find Ratio</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xl font-bold text-slate-900">
            <input
              type="number"
              value={s2X}
              onChange={e => setS2X(e.target.value)}
              className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none text-center"
            />
            <span>is what % of</span>
            <input
              type="number"
              value={s2Y}
              onChange={e => setS2Y(e.target.value)}
              className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none text-center"
            />
            <span>?</span>
          </div>
          <div
            onClick={() => handleCopy(s2Result)}
            className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100 flex justify-between items-center cursor-pointer hover:bg-cyan-100 transition-colors group"
          >
            <span className="text-red-400 font-bold uppercase tracking-wider">Result</span>
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-black text-cyan-600">{s2Result}%</span>
              <div className="text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to copy
              </div>
            </div>
          </div>
        </div>

        {/* Scenario 3 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-400">
            {parseFloat(s3Result) >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <h2 className="text-sm font-bold uppercase tracking-widest">Percentage Change</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xl font-bold text-slate-900">
            <span>From</span>
            <input
              type="number"
              value={s3From}
              onChange={e => setS3From(e.target.value)}
              className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none text-center"
            />
            <span>to</span>
            <input
              type="number"
              value={s3To}
              onChange={e => setS3To(e.target.value)}
              className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none text-center"
            />
          </div>
          <div
            onClick={() => handleCopy(s3Result)}
            className={`p-6 rounded-2xl border flex justify-between items-center cursor-pointer transition-colors group ${parseFloat(s3Result) >= 0 ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' : 'bg-rose-50 border-rose-100 hover:bg-rose-100'}`}
          >
            <span
              className={`font-bold uppercase tracking-wider ${parseFloat(s3Result) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {parseFloat(s3Result) >= 0 ? 'Increase' : 'Decrease'}
            </span>
            <div className="flex items-center space-x-4">
              <span
                className={`text-4xl font-black ${parseFloat(s3Result) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {Math.abs(parseFloat(s3Result))}%
              </span>
              <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to copy
              </div>
            </div>
          </div>
        </div>
      </div>
      <AboutTool toolId={ToolID.PERCENTAGE_CALCULATOR} />
    </div>
  );
};
