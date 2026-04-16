import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Palette, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface ColorConverterProps {
  onBack: () => void;
}

export const ColorConverter: React.FC<ColorConverterProps> = ({ onBack }) => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.COLOR_CONVERTER] || {
    title: 'Color Converter',
    icon: Palette,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  };

  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h.slice(1, 3), 16);
      g = parseInt(h.slice(3, 5), 16);
      b = parseInt(h.slice(5, 7), 16);
    }
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  useEffect(() => {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      const { r, g, b } = hexToRgb(hex);
      setRgb(`rgb(${r}, ${g}, ${b})`);
      const { h, s, l } = rgbToHsl(r, g, b);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    }
  }, [hex]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Color copied');
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
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">HEX Color</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-mono text-xl uppercase"
                />
                <input
                  type="color"
                  value={hex.length === 7 ? hex : '#000000'}
                  onChange={(e) => setHex(e.target.value)}
                  className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'RGB', value: rgb },
                { label: 'HSL', value: hsl }
              ].map((c) => (
                <div key={c.label} className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{c.label}</label>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-sm group">
                    <span>{c.value}</span>
                    <button onClick={() => handleCopy(c.value)} className="text-slate-300 hover:text-pink-600 transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className="flex-1 rounded-3xl shadow-inner border border-slate-200 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
             <div className={`p-8 rounded-2xl backdrop-blur-md border ${parseInt(hex.replace('#',''), 16) > 0xffffff/2 ? 'bg-black/10 border-black/5 text-black' : 'bg-white/10 border-white/10 text-white'} text-center font-black text-2xl shadow-xl`}>
               {hex.toUpperCase()}
             </div>
          </div>
          <div className="mt-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-2">Palette Generation</h3>
             <div className="flex space-x-2 h-12">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                  <div
                    key={o}
                    className="flex-1 rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-sm"
                    style={{ backgroundColor: hex, opacity: o }}
                    onClick={() => {
                        // Lighten/darken based on opacity - for now just show
                    }}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
