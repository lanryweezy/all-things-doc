import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { downloadBlob } from '../../utils/downloadUtils';

interface SvgConverterProps {
  onBack: () => void;
}

export const SvgConverter: React.FC<SvgConverterProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolID.SVG_CONVERTER];

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const text = await file.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      const width = parseInt(svgElement.getAttribute('width') || '300') * scale;
      const height = parseInt(svgElement.getAttribute('height') || '300') * scale;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      const svgBlob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            setResultBlob(blob);
            setPreviewUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.src = url;
    } catch (err) {
      alert('Error converting SVG');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      downloadBlob(resultBlob, 'converted-svg.png');
    }
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {!resultBlob ? (
          <div className="space-y-6">
            <FileUpload accept=".svg" onFileSelect={setFile} label="Upload SVG File" />

            {file && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resolution Scale: {scale}x</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scale}
                    onChange={(e) => setScale(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-doc-red"
                  />
                </div>
                <div className="flex justify-center">
                  <Button onClick={handleConvert} isLoading={isProcessing} className="bg-doc-slate min-w-[200px]" icon={<RefreshCw size={18} />}>
                    Convert to PNG
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <img src={previewUrl!} alt="Preview" className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-sm border border-slate-100" />
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setResultBlob(null)} variant="outline">Convert Another</Button>
              <Button onClick={handleDownload} className="bg-emerald-600" icon={<Download size={18} />}>
                Download PNG
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
