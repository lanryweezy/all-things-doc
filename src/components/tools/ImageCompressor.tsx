import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Minimize2, Download, RefreshCw, FileImage } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { downloadBlob } from '../../utils/downloadUtils';

interface ImageCompressorProps {
  onBack: () => void;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const toolInfo = TOOLS[ToolID.IMAGE_COMPRESSOR];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setOriginalSize(file.size);

    try {
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultBlob(blob);
          setCompressedSize(blob.size);
          setPreviewUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', quality);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob && file) {
      downloadBlob(resultBlob, `compressed-${file.name.split('.')[0]}.jpg`);
    }
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {!resultBlob ? (
          <div className="space-y-6">
            <FileUpload accept="image/*" onFileSelect={setFile} label="Upload Image to Compress" />

            {file && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700 uppercase">Compression Level</label>
                    <span className="text-sm font-bold text-cyan-600">{Math.round((1 - quality) * 100)}% Reduction Target</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 italic">
                    <span>High Compression (Smaller Size)</span>
                    <span>Low Compression (Better Quality)</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleCompress} isLoading={isProcessing} className="bg-slate-900 min-w-[200px]" icon={<Minimize2 size={18} />}>
                    Compress Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Original</div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                   <div className="text-xl font-bold text-slate-700">{formatSize(originalSize)}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Compressed</div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                   <div className="text-xl font-bold text-green-700">{formatSize(compressedSize)}</div>
                   <div className="text-xs text-green-600 font-bold">-{Math.round((1 - (compressedSize / originalSize)) * 100)}% smaller</div>
                </div>
              </div>
            </div>

            <img src={previewUrl!} alt="Compressed Preview" className="max-w-full max-h-[400px] mx-auto rounded-xl shadow-md border border-slate-100" />

            <div className="flex justify-center space-x-4">
              <Button onClick={() => setResultBlob(null)} variant="outline">Compress Another</Button>
              <Button onClick={handleDownload} className="bg-emerald-600" icon={<Download size={18} />}>
                Download Compressed Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
