import React, { useState } from 'react';
import { ArrowLeft, FileSpreadsheet, FileText, Download, Presentation, ScanLine } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { ResultDisplay } from '../ui/ResultDisplay';
import { fileToBase64 } from '../../services/imageService';
import { processPdf } from '../../services/geminiService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface PdfAiToolProps {
  toolId: ToolID.PDF_TO_WORD | ToolID.PDF_TO_EXCEL | ToolID.PDF_TO_POWERPOINT | ToolID.PDF_OCR;
  onBack: () => void;
}

export const PdfAiTool: React.FC<PdfAiToolProps> = ({ toolId, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'markdown' | 'text'>('markdown');
  
  const toolInfo = TOOLS[toolId];

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const base64 = await fileToBase64(file);
      let mode: 'WORD' | 'EXCEL' | 'PPT' | 'OCR' = 'WORD';
      if (toolId === ToolID.PDF_TO_EXCEL) mode = 'EXCEL';
      if (toolId === ToolID.PDF_TO_POWERPOINT) mode = 'PPT';
      if (toolId === ToolID.PDF_OCR) mode = 'OCR';

      const output = await processPdf(base64, mode, outputFormat);
      setResult(output);
    } catch (error) {
      console.error(error);
      setResult("Error processing PDF. Please ensure it is a valid PDF file and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadOutline = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation_outline.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getActionIcon = () => {
    switch (toolId) {
      case ToolID.PDF_TO_EXCEL: return <FileSpreadsheet size={18} />;
      case ToolID.PDF_TO_POWERPOINT: return <Presentation size={18} />;
      case ToolID.PDF_OCR: return <ScanLine size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const getButtonText = () => {
    switch (toolId) {
      case ToolID.PDF_TO_EXCEL: return "Convert to Excel/CSV";
      case ToolID.PDF_TO_POWERPOINT: return "Generate Slide Outline";
      case ToolID.PDF_OCR: return "Recognize Text";
      default: return "Convert Document";
    }
  };

  const getButtonColor = () => {
     switch (toolId) {
      case ToolID.PDF_TO_EXCEL: return "bg-emerald-600 hover:bg-emerald-700";
      case ToolID.PDF_TO_POWERPOINT: return "bg-orange-600 hover:bg-orange-700";
      case ToolID.PDF_OCR: return "bg-cyan-600 hover:bg-cyan-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <FileUpload 
          accept="application/pdf"
          selectedFile={file}
          onFileSelect={(f) => { setFile(f); setResult(null); }}
          onClear={() => { setFile(null); setResult(null); }}
          label="Upload a PDF Document"
        />

        {file && !result && (
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div className="flex-grow">
               {(toolId === ToolID.PDF_TO_WORD || toolId === ToolID.PDF_OCR) && (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-sm font-semibold text-doc-slate mb-3">Output Format</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                           <input 
                            type="radio" 
                            name="format" 
                            value="markdown" 
                            checked={outputFormat === 'markdown'} 
                            onChange={() => setOutputFormat('markdown')}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-doc-red checked:bg-doc-red transition-all"
                          />
                          <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="ml-2 text-sm text-slate-700 font-medium group-hover:text-doc-slate">Markdown (Structured)</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                         <div className="relative flex items-center justify-center">
                           <input 
                            type="radio" 
                            name="format" 
                            value="text" 
                            checked={outputFormat === 'text'} 
                            onChange={() => setOutputFormat('text')}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-doc-red checked:bg-doc-red transition-all"
                          />
                          <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="ml-2 text-sm text-slate-700 font-medium group-hover:text-doc-slate">Plain Text</span>
                      </label>
                    </div>
                 </div>
               )}
               {toolId === ToolID.PDF_TO_POWERPOINT && (
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-800 font-medium flex items-center">
                      <Presentation size={16} className="mr-2" />
                      The AI will analyze the PDF and generate a structured outline for your slides.
                    </p>
                 </div>
               )}
             </div>
            <Button 
              onClick={handleProcess} 
              isLoading={isProcessing}
              className={getButtonColor()}
              icon={getActionIcon()}
            >
              {getButtonText()}
            </Button>
          </div>
        )}

        {isProcessing && (
           <div className="mt-8 text-center text-slate-500 animate-pulse">
             <p>Analyzing document structure with AI...</p>
           </div>
        )}

        {result && (
          <>
            <ResultDisplay 
              title={toolId === ToolID.PDF_TO_EXCEL ? "Extracted CSV Data" : toolId === ToolID.PDF_TO_POWERPOINT ? "Generated Slide Outline" : "Extracted Content"} 
              content={result}
              isCode={toolId === ToolID.PDF_TO_EXCEL} 
            />
            
            {toolId === ToolID.PDF_TO_EXCEL && (
               <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleDownloadCsv}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    icon={<Download size={18} />}
                  >
                    Download .CSV
                  </Button>
               </div>
            )}

            {toolId === ToolID.PDF_TO_POWERPOINT && (
               <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleDownloadOutline}
                    className="bg-orange-600 hover:bg-orange-700"
                    icon={<Download size={18} />}
                  >
                    Download Outline (.MD)
                  </Button>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};