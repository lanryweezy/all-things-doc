import React, { useState } from 'react';
import { FileText, Search, Brain, Loader2, CheckCircle, Download, Beaker } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { useToast } from '../ui/Toast';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';
import { ResultDisplay } from '../ui/ResultDisplay';

interface PdfAiToolProps {
  toolId: ToolID.PDF_AI_QUERY | ToolID.PDF_AI_SUMMARIZE | ToolID.PDF_AI_EXTRACT;
  onBack: () => void;
}

export const PdfAiTool: React.FC<PdfAiToolProps> = ({ toolId, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Simulate AI processing
      setTimeout(() => {
        setResult("This is a simulated AI response for your PDF. In a production environment, this would call our secure Gemini-powered backend to analyze the document content.");
        setIsProcessing(false);
        showToast('AI Analysis Complete');
      }, 2000);
    } catch (err) {
      showToast('AI Processing Failed', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout toolId={toolId} onBack={onBack}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-8 transition-colors">
        <FileUpload accept="application/pdf" onFileSelect={setFile} label="Upload PDF for AI Analysis" />

        {file && !result && (
          <div className="space-y-6 animate-in fade-in duration-500">
             {toolId === ToolID.PDF_AI_QUERY && (
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Your Question</label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                    placeholder="Ask something about this PDF..."
                  />
               </div>
             )}

             <div className="flex justify-center">
                <Button
                  onClick={handleProcess}
                  isLoading={isProcessing}
                  className="bg-cyan-700 hover:bg-cyan-800 px-12 transition-colors"
                  icon={<Brain size={18} />}
                >
                  Analyze with AI
                </Button>
             </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <ResultDisplay title="AI Analysis Result" content={result} />
            <div className="flex justify-center">
               <Button onClick={() => { setFile(null); setResult(null); }} variant="outline" icon={<RefreshCw size={18} />}>
                  Analyze Another PDF
               </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

import { RefreshCw } from 'lucide-react';
