import React, { useState, useEffect } from 'react';
import { ArrowLeft, ScanLine, Cpu, Zap } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'local' | 'ai'>('local');
  const [localLang, setLocalLang] = useState('eng');
  const toolInfo = TOOLS[ToolID.SMART_OCR];

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    setProgress(0);

    try {
      if (mode === 'ai') {
        const base64 = await fileToBase64(file);
        const text = await performOCR(base64, file.type);
        setResult(text);
      } else {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker({
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        await worker.loadLanguage(localLang);
        await worker.initialize(localLang);
        const {
          data: { text },
        } = await worker.recognize(file);
        await worker.terminate();
        setResult(text);
      }
    } catch (error) {
      console.error(error);
      setResult('Error extracting text. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
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
          <div className="mt-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="font-bold text-slate-900">Processing Mode</h3>
                <p className="text-xs text-slate-500">Choose between local speed or AI accuracy</p>
              </div>
              <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                <button
                  onClick={() => setMode('local')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    mode === 'local'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Cpu size={16} />
                  <span>Local (Fast & Private)</span>
                </button>
                <button
                  onClick={() => setMode('ai')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    mode === 'ai'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Zap size={16} />
                  <span>AI Intelligence</span>
                </button>
              </div>
            </div>

            {mode === 'local' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label htmlFor="local-lang" className="block text-sm font-bold text-slate-700 mb-2">
                  OCR Language
                </label>
                <select
                  id="local-lang"
                  value={localLang}
                  onChange={e => setLocalLang(e.target.value)}
                  className="w-full md:w-64 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                >
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                  <option value="chi_sim">Chinese (Simplified)</option>
                  <option value="jpn">Japanese</option>
                </select>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleExtract}
                isLoading={isProcessing}
                className={
                  mode === 'ai'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }
                icon={<ScanLine size={18} />}
              >
                Start Extraction
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-10 text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div
                className={`absolute inset-0 border-4 rounded-full border-t-transparent animate-spin ${mode === 'ai' ? 'border-indigo-600' : 'border-emerald-600'}`}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900">
                {progress > 0 ? `${progress}%` : ''}
              </div>
            </div>
            <div className="text-slate-600 font-medium">
              {mode === 'ai' ? 'Using AI to analyze document...' : 'Processing on your device...'}
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {mode === 'local'
                ? 'Your file never leaves your browser.'
                : 'Optimizing text recognition with AI models.'}
            </p>
          </div>
        )}

        {result && <ResultDisplay title="Extracted Text" content={result} />}
      </div>
    </div>
  );
};
