import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, QrCode, Download, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import QRCode from 'qrcode';

interface QrGeneratorProps {
  onBack: () => void;
}

export const QrGenerator: React.FC<QrGeneratorProps> = ({ onBack }) => {
  const [input, setInput] = useState('https://allthingsdoc.com');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toolInfo = TOOLS[ToolID.QR_GENERATOR];

  const generateQR = async () => {
    if (!input.trim()) return;
    try {
      const url = await QRCode.toDataURL(input, {
        width: size,
        margin: margin,
        color: {
          dark: '#0f172a', // slate-900
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 300);
    return () => clearTimeout(timer);
  }, [input, size, margin]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content (URL or Text)</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none resize-none text-sm"
              placeholder="Enter link or text for the QR code..."
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="qr-size" className="block text-sm font-medium text-slate-700 mb-1">Size: {size}px</label>
              <input
                id="qr-size"
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-doc-red"
              />
            </div>
            <div>
              <label htmlFor="qr-margin" className="block text-sm font-medium text-slate-700 mb-1">Margin: {margin}</label>
              <input
                id="qr-margin"
                type="range"
                min="0"
                max="10"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-doc-red"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center space-y-6">
          {qrDataUrl ? (
            <div className="p-4 bg-white border-4 border-slate-100 rounded-2xl shadow-inner">
              <img src={qrDataUrl} alt="QR Code" className="max-w-full h-auto rounded-lg" />
            </div>
          ) : (
            <div className="w-64 h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 w-full">
            <Button
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="bg-doc-slate hover:bg-slate-800 flex-grow"
              icon={<Download size={18} />}
            >
              Download PNG
            </Button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-slate-500" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
