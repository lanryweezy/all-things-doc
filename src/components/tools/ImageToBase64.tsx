import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Code, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface ImageToBase64Props {
  onBack: () => void;
}

export const ImageToBase64: React.FC<ImageToBase64Props> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.IMAGE_TO_BASE64];

  const handleFileSelect = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64(e.target?.result as string);
    };
    reader.readAsDataURL(f);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-8 flex-shrink-0 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
      </div>

      <div className="flex-grow flex flex-col min-h-0 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFileSelect} label="Upload Image to Convert to Base64" />

        {base64 && (
          <div className="flex-grow flex flex-col min-h-0 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base64 Data URI</span>
               <button onClick={handleCopy} className="text-cyan-600 hover:text-cyan-700 text-xs font-bold flex items-center">
                  {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  {copied ? 'COPIED!' : 'COPY CODE'}
               </button>
            </div>
            <textarea
              readOnly
              value={base64}
              className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-[10px] resize-none outline-none text-slate-600"
            />
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
               <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center border border-blue-200 overflow-hidden">
                  <img src={base64} alt="Preview" className="max-w-full max-h-full object-contain" />
               </div>
               <div className="text-sm text-blue-800 font-medium">
                  {file?.name} • {(base64.length / 1024).toFixed(1)} KB
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
