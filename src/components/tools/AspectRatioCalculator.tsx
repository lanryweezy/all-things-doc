import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../ui/ToolLayout';
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
    <ToolLayout toolId={ToolID.ASPECT_RATIO_CALCULATOR} onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-8 transition-colors">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Base Dimension</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 transition-colors">Width</label>
                <input
                  type="number"
                  value={w1}
                  onChange={(e) => setW1(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 transition-colors">Height</label>
                <input
                  type="number"
                  value={h1}
                  onChange={(e) => setH1(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-colors"
                />
              </div>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-xl text-center transition-colors">
              <span className="text-xs font-bold text-cyan-400 uppercase mr-2 transition-colors">Calculated Ratio</span>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 transition-colors">{ratio}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Scale Result</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 transition-colors">New Width</label>
                <input
                  type="number"
                  value={w2}
                  onChange={(e) => handleW2Change(e.target.value)}
                  placeholder="Type to scale..."
                  className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 transition-colors">New Height</label>
                <input
                  type="number"
                  value={h2}
                  onChange={(e) => handleH2Change(e.target.value)}
                  placeholder="Type to scale..."
                  className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group min-h-[200px] flex items-center justify-center shadow-2xl transition-all">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <div
                 className="bg-white/10 border border-white/20 rounded-lg shadow-2xl transition-all duration-700"
                 style={{
                    aspectRatio: ratio.replace(':', '/'),
                    maxHeight: '100%',
                    maxWidth: '100%',
                    width: '80%'
                 }}
              />
              <div className="absolute bottom-6 right-8 text-[10px] font-black uppercase tracking-widest text-white/40">Visualizer (Scaled)</div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 transition-colors">Common Presets</h3>
              <div className="space-y-2">
                {presets.map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setW1(p.w.toString()); setH1(p.h.toString()); }}
                    className="w-full flex justify-between items-center p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all active:scale-[0.98]"
                  >
                    <span>{p.name}</span>
                    <span className="font-mono text-[10px] font-black bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg transition-colors">{p.w} x {p.h}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>
    </ToolLayout>
  );
};
