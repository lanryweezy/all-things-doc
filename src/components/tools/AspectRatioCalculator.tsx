import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize, RefreshCw, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface AspectRatioCalculatorProps {
  onBack: () => void;
}

export const AspectRatioCalculator: React.FC<AspectRatioCalculatorProps> = ({ onBack }) => {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [w2, setW2] = useState('');
  const [h2, setH2] = useState('');
  const [ratio, setRatio] = useState('16:9');
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.ASPECT_RATIO_CALCULATOR];

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  useEffect(() => {
    const width = parseInt(w1);
    const height = parseInt(h1);
    if (width > 0 && height > 0) {
      const common = gcd(width, height);
      setRatio(`${width / common}:${height / common}`);
    }
  }, [w1, h1]);

  const handleW2Change = (val: string) => {
    setW2(val);
    const width = parseInt(w1);
    const height = parseInt(h1);
    const newW = parseInt(val);
    if (width > 0 && height > 0 && newW > 0) {
      setH2(Math.round((newW * height) / width).toString());
    }
  };

  const handleH2Change = (val: string) => {
    setH2(val);
    const width = parseInt(w1);
    const height = parseInt(h1);
    const newH = parseInt(val);
    if (width > 0 && height > 0 && newH > 0) {
      setW2(Math.round((newH * width) / height).toString());
    }
  };

  const presets = [
    { name: '16:9 (Widescreen)', w: 1920, h: 1080 },
    { name: '4:3 (SD Video)', w: 1024, h: 768 },
    { name: '1:1 (Square)', w: 1080, h: 1080 },
    { name: '9:16 (TikTok)', w: 1080, h: 1920 },
    { name: '21:9 (Ultrawide)', w: 3440, h: 1440 },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Base Dimension</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Width</label>
                <input
                  type="number"
                  value={w1}
                  onChange={(e) => setW1(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Height</label>
                <input
                  type="number"
                  value={h1}
                  onChange={(e) => setH1(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase mr-2">Calculated Ratio</span>
              <span className="text-2xl font-black text-indigo-600">{ratio}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scale Result</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">New Width</label>
                <input
                  type="number"
                  value={w2}
                  onChange={(e) => handleW2Change(e.target.value)}
                  placeholder="Type to scale..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">New Height</label>
                <input
                  type="number"
                  value={h2}
                  onChange={(e) => handleH2Change(e.target.value)}
                  placeholder="Type to scale..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group min-h-[200px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <div
                 className="bg-white/10 border border-white/20 rounded-lg shadow-2xl transition-all duration-500"
                 style={{
                    aspectRatio: ratio.replace(':', '/'),
                    maxHeight: '100%',
                    maxWidth: '100%',
                    width: '80%'
                 }}
              />
              <div className="absolute bottom-4 right-6 text-xs font-mono text-white/40">Visualizer (scaled to fit)</div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Common Presets</h3>
              <div className="space-y-2">
                {presets.map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setW1(p.w.toString()); setH1(p.h.toString()); }}
                    className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 transition-colors"
                  >
                    <span>{p.name}</span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-md">{p.w}x{p.h}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>
      <AboutTool toolId={ToolID.ASPECT_RATIO_CALCULATOR} />
    </div>
  );
};
