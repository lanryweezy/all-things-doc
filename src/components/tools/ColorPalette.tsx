import React, { useState } from 'react';
import { ArrowLeft, Palette, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface ColorPaletteProps {
  onBack: () => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolID.COLOR_PALETTE];

  const extractPalette = async (imgFile: File) => {
    setIsProcessing(true);
    const img = new Image();
    const url = URL.createObjectURL(imgFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      if (!imageData) return;

      const colors: Record<string, number> = {};
      // Sample every 100th pixel for performance
      for (let i = 0; i < imageData.length; i += 400) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }

      const sortedColors = Object.entries(colors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([color]) => color);

      setPalette(sortedColors);
      setIsProcessing(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        <FileUpload
          accept="image/*"
          onFileSelect={(f) => { setFile(f); extractPalette(f); }}
          label="Upload Image to Extract Palette"
        />

        {isProcessing && (
          <div className="text-center text-slate-500 animate-pulse font-bold">
            Extracting color essence...
          </div>
        )}

        {palette.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {palette.map((color) => (
              <div
                key={color}
                onClick={() => handleCopy(color)}
                className="group relative h-32 rounded-2xl border border-slate-100 cursor-pointer overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-sm"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="bg-white px-3 py-1.5 rounded-lg font-mono text-sm font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedColor === color ? 'COPIED!' : color.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
