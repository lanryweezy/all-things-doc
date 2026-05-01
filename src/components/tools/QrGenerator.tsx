import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, QrCode, Download, RefreshCw, Copy, Check, Scan } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
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
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScan = async (f: File) => {
    const jsQR = (await import('jsqr')).default;
    const img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScanResult(code.data);
        } else {
          showToast('No QR code found in image', 'error');
        }
      }
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setMode('generate')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'generate' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}
          >
            Generate
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'scan' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}
          >
            Scan / Read
          </button>
        </div>
      </div>

      {mode === 'generate' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content (URL or Text)
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none text-sm"
                placeholder="Enter link or text for the QR code..."
              />
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="qr-size" className="block text-sm font-medium text-slate-700 mb-1">
                  Size: {size}px
                </label>
                <input
                  id="qr-size"
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={e => setSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
              </div>
              <div>
                <label
                  htmlFor="qr-margin"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Margin: {margin}
                </label>
                <input
                  id="qr-margin"
                  type="range"
                  min="0"
                  max="10"
                  value={margin}
                  onChange={e => setMargin(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
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
                className="bg-slate-900 hover:bg-slate-800 flex-grow"
                icon={<Download size={18} />}
              >
                Download PNG
              </Button>
              <button
                onClick={() => handleCopy(input)}
                className="flex items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                title="Copy content"
              >
                {copied ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-slate-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
          <FileUpload
            accept="image/*"
            onFileSelect={handleScan}
            label="Upload QR Code Image to Read"
          />

          {scanResult && (
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 relative animate-fade-in">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Scanned Content
              </h3>
              <div className="text-lg font-medium text-slate-700 break-all mb-4">{scanResult}</div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleCopy(scanResult)}
                  variant="outline"
                  icon={copied ? <Check size={18} /> : <Copy size={18} />}
                >
                  {copied ? 'Copied!' : 'Copy Result'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
