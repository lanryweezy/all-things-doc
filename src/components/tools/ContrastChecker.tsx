import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Palette, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface ContrastCheckerProps {
  onBack: () => void;
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({ onBack }) => {
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#6366F1');
  const [contrast, setContrast] = useState<number>(0);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.COLOR_CONTRAST_CHECKER] || {
    title: 'Contrast Checker',
    icon: Palette,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  };

  const getLuminance = (hex: string) => {
    const rgb = hexToRgb(hex);
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  useEffect(() => {
    const l1 = getLuminance(fgColor);
    const l2 = getLuminance(bgColor);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    setContrast(parseFloat(ratio.toFixed(2)));
  }, [fgColor, bgColor]);

  const results = [
    { label: 'WCAG AA (Normal Text)', threshold: 4.5 },
    { label: 'WCAG AA (Large Text)', threshold: 3.0 },
    { label: 'WCAG AAA (Normal Text)', threshold: 7.0 },
    { label: 'WCAG AAA (Large Text)', threshold: 4.5 },
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
        <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Foreground</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-mono text-sm uppercase"
                  />
                  <input
                    type="color"
                    value={fgColor.startsWith('#') && fgColor.length === 7 ? fgColor : '#000000'}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-100 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Background</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-mono text-sm uppercase"
                  />
                  <input
                    type="color"
                    value={bgColor.startsWith('#') && bgColor.length === 7 ? bgColor : '#000000'}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-100 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="text-6xl font-black text-slate-900 mb-1">{contrast}:1</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contrast Ratio</div>
            </div>

            <div className="space-y-3">
              {results.map((res, i) => {
                const passes = contrast >= res.threshold;
                return (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${passes ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                    <span className="text-sm font-bold">{res.label}</span>
                    <div className="flex items-center space-x-2">
                       <span className="text-xs font-bold uppercase">{passes ? 'Pass' : 'Fail'}</span>
                       {passes ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              <div
                className="flex-1 p-12 flex flex-col justify-center items-center text-center space-y-4 transition-colors duration-700"
                style={{ backgroundColor: bgColor, color: fgColor }}
              >
                 <h2 className="text-4xl font-black">Main Heading</h2>
                 <p className="max-w-xs text-lg font-medium leading-relaxed">
                   This is a preview of how your chosen colors will look together for text and backgrounds.
                 </p>
                 <button className="px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest border-4" style={{ borderColor: fgColor }}>
                    Sample Button
                 </button>
              </div>
           </div>

           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
              <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
              <div className="text-xs text-blue-800 leading-relaxed font-medium">
                 The Web Content Accessibility Guidelines (WCAG) recommend a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text to ensure content is readable for users with visual impairments.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
