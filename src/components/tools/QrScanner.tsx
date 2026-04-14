import React, { useState, useRef } from 'react';
import { ArrowLeft, Scan, Upload, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import jsQR from 'jsqr';

interface QrScannerProps {
  onBack: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onBack }) => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.QR_SCANNER];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setResult(code.data);
          showToast('QR code decoded successfully');
        } else {
          showToast('No QR code found in image', 'error');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      showToast('Result copied');
    }
  };

  const handleReset = () => {
    setResult(null);
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
        {!result ? (
          <div className="flex flex-col items-center justify-center text-center space-y-8 py-10">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center animate-pulse">
              <Scan size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-doc-slate">Scan QR Code</h2>
              <p className="text-slate-500 max-w-sm">Upload an image containing a QR code to decode its contents instantly.</p>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 px-10 py-6 text-lg"
              icon={<Upload size={20} />}
            >
              Upload Image
            </Button>

            <div className="text-xs text-slate-400 font-medium italic">
              Privacy First: Processing is done entirely in your browser.
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scanned Result</h3>
              <button onClick={handleReset} className="text-slate-400 hover:text-indigo-600 flex items-center text-sm font-bold">
                <RefreshCw size={14} className="mr-1" /> New Scan
              </button>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 break-all font-mono text-lg text-doc-slate relative group">
              {result}
              <div className="absolute right-4 bottom-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleCopy} className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:text-indigo-600">
                  <Copy size={18} />
                </button>
                {result.startsWith('http') && (
                  <a href={result} target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:text-indigo-600">
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-center">
               <Button onClick={handleCopy} className="bg-indigo-600 px-8" icon={<Copy size={18} />}>
                 Copy Result
               </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
