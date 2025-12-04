import React, { useState } from 'react';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { ResultDisplay } from '../ui/ResultDisplay';
import { fileToBase64 } from '../../services/imageService';
import { performOCR } from '../../services/geminiService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface SmartOCRProps {
  onBack: () => void;
}

export const SmartOCR: React.FC<SmartOCRProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const toolInfo = TOOLS[ToolID.SMART_OCR];

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const base64 = await fileToBase64(file);
      const text = await performOCR(base64, file.type);
      setResult(text);
    } catch (error) {
      console.error(error);
      setResult('Error extracting text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4"
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <FileUpload
          accept="image/*"
          selectedFile={file}
          onFileSelect={f => {
            setFile(f);
            setResult(null);
          }}
          onClear={() => {
            setFile(null);
            setResult(null);
          }}
          label="Upload an image or document scan"
        />

        {file && !result && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleExtract}
              isLoading={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
              icon={<ScanLine size={18} />}
            >
              Extract Text
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-8 text-center text-slate-500 animate-pulse">
            <p>Analyzing image structure and extracting text...</p>
          </div>
        )}

        {result && <ResultDisplay title="Extracted Text" content={result} />}
      </div>
    </div>
  );
};
