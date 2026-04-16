import React, { useState } from 'react';
import {
  FileText,
  Download,
  RefreshCw,
  Trash2,
  Scissors,
  Merge,
  FileLock,
  EyeOff,
  Layers,
  Minimize2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { useToast } from '../ui/Toast';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';
import * as pdfService from '../../services/pdfService';
import { downloadBinary } from '../../utils/downloadUtils';

interface PdfGeneralToolProps {
  toolId: ToolID.PDF_MERGE | ToolID.PDF_SPLIT | ToolID.PDF_PROTECT | ToolID.PDF_UNLOCK | ToolID.PDF_COMPRESS;
  onBack: () => void;
}

export const PdfGeneralTool: React.FC<PdfGeneralToolProps> = ({ toolId, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      let result: Uint8Array;
      switch (toolId) {
        case ToolID.PDF_PROTECT:
          result = await pdfService.protectPdf(file, password);
          downloadBinary(result, 'protected.pdf', 'application/pdf');
          break;
        case ToolID.PDF_UNLOCK:
          result = await pdfService.unlockPdf(file, password);
          downloadBinary(result, 'unlocked.pdf', 'application/pdf');
          break;
        case ToolID.PDF_COMPRESS:
          result = await pdfService.compressPdf(file);
          downloadBinary(result, 'compressed.pdf', 'application/pdf');
          break;
        default:
          throw new Error('Action not supported in this view');
      }
      showToast('Action Completed Successfully');
    } catch (err: any) {
      showToast(err.message || 'Processing Failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    switch (toolId) {
      case ToolID.PDF_MERGE: return <Layers />;
      case ToolID.PDF_SPLIT: return <Scissors />;
      case ToolID.PDF_PROTECT: return <FileLock />;
      case ToolID.PDF_UNLOCK: return <EyeOff />;
      case ToolID.PDF_COMPRESS: return <Minimize2 />;
      default: return <FileText />;
    }
  };

  return (
    <ToolLayout toolId={toolId} onBack={onBack}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-8 transition-colors">
        <FileUpload accept="application/pdf" onFileSelect={setFile} label="Upload PDF Document" />

        {file && (
          <div className="space-y-6 animate-in fade-in duration-500">
             {(toolId === ToolID.PDF_PROTECT || toolId === ToolID.PDF_UNLOCK) && (
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Password Required</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold"
                    placeholder="Enter password..."
                  />
               </div>
             )}

             <div className="flex justify-center">
                <Button
                  onClick={handleProcess}
                  isLoading={isProcessing}
                  className="bg-cyan-700 hover:bg-cyan-800 px-12 transition-colors"
                  icon={getIcon()}
                >
                  Start Processing
                </Button>
             </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
