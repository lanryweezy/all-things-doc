import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileSpreadsheet, FileText, Download, Presentation, ScanLine, Link } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../FileUpload';
import { ResultDisplay } from '../ui/ResultDisplay';
import { LoadingSpinner, ProcessingProgress } from '../LoadingSpinner';
import { fileToBase64 } from '../../services/imageService';
import { processPdf } from '../../services/geminiService';
import { analytics } from '../../services/analytics';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { jsPDF } from "jspdf";
import { downloadText, downloadBinary } from '../../utils/downloadUtils';

interface PdfAiToolProps {
  toolId: ToolID.PDF_TO_WORD | ToolID.PDF_TO_EXCEL | ToolID.PDF_TO_POWERPOINT | ToolID.PDF_OCR | ToolID.PDF_BANK_STATEMENT_CONVERTER;
  onBack: () => void;
}

export const PdfAiTool: React.FC<PdfAiToolProps> = ({ toolId, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'markdown' | 'text'>('markdown');
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const toolInfo = TOOLS[toolId];

  // Manage download URLs for different content types
  useEffect(() => {
    if (result) {
      if (toolId === ToolID.PDF_TO_EXCEL || toolId === ToolID.PDF_BANK_STATEMENT_CONVERTER) {
        // CSV content
        const blob = new Blob([result], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } else if (toolId === ToolID.PDF_TO_POWERPOINT) {
        // Markdown content
        const blob = new Blob([result], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } else if (toolId === ToolID.PDF_OCR) {
        // For PDF OCR, we'll handle the PDF generation in the download function
        setDownloadUrl(null);
      } else {
        setDownloadUrl(null);
      }
    } else {
      setDownloadUrl(null);
    }
  }, [result, toolId]);

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    setProgress(0);

    // Track tool usage
    analytics.trackToolUsage(toolId, 'Started');

    // Simulate progress while waiting for API
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev === undefined) return 0;
        // Cap artificial progress at 90% until real response comes back
        if (prev >= 90) return prev;
        // Random increment between 5-15%
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 600);

    try {
      const base64 = await fileToBase64(file);
      let mode: 'WORD' | 'EXCEL' | 'PPT' | 'OCR' | 'BANK_STATEMENT' = 'WORD';
      if (toolId === ToolID.PDF_TO_EXCEL) mode = 'EXCEL';
      if (toolId === ToolID.PDF_TO_POWERPOINT) mode = 'PPT';
      if (toolId === ToolID.PDF_OCR) mode = 'OCR';
      if (toolId === ToolID.PDF_BANK_STATEMENT_CONVERTER) mode = 'BANK_STATEMENT';

      const output = await processPdf(base64, mode, outputFormat);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Small delay to let user see 100% completion
      await new Promise(r => setTimeout(r, 500));
      
      setResult(output);
    } catch (error) {
      console.error('PDF Processing Error:', error);
      let errorMessage = "Error processing PDF. ";
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage += "Network error. Please check your connection and try again.";
        } else if (error.message.includes('timeout')) {
          errorMessage += "Request timed out. Please try again with a smaller file.";
        } else if (error.message.includes('invalid')) {
          errorMessage += "Invalid PDF format. Please ensure it's a valid PDF file.";
        } else {
          errorMessage += "Please ensure it is a valid PDF file and try again.";
        }
      } else {
        errorMessage += "An unexpected error occurred. Please try again.";
      }
      
      setResult(errorMessage);
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
      setProgress(undefined);
    }
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    try {
      const filename = `converted_data.csv`;
      downloadText(result, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or check your browser settings.');
    }
  };

  const handleDownloadOutline = () => {
    if (!result) return;
    try {
      const filename = `presentation_outline.md`;
      downloadText(result, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or check your browser settings.');
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      
      doc.setFont("helvetica");
      doc.setFontSize(12);
      
      // Split text into lines that fit the page width
      const splitText = doc.splitTextToSize(result, maxWidth);
      
      let y = margin;
      const lineHeight = 7;
      
      splitText.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      // Get the PDF data as Uint8Array and download using utility
      const pdfData = doc.output('arraybuffer');
      const uint8Array = new Uint8Array(pdfData);
      downloadBinary(uint8Array, 'searchable_document.pdf', 'application/pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again or check your browser settings.');
    }
  };

  const getActionIcon = () => {
    switch (toolId) {
      case ToolID.PDF_TO_EXCEL: return <FileSpreadsheet size={18} />;
      case ToolID.PDF_TO_POWERPOINT: return <Presentation size={18} />;
      case ToolID.PDF_OCR: return <ScanLine size={18} />;
      case ToolID.PDF_BANK_STATEMENT_CONVERTER: return <FileSpreadsheet size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const getButtonText = () => {
    switch (toolId) {
      case ToolID.PDF_TO_EXCEL: return "Convert to Excel/CSV";
      case ToolID.PDF_TO_POWERPOINT: return "Generate Slide Outline";
      case ToolID.PDF_OCR: return "Recognize Text";
      case ToolID.PDF_BANK_STATEMENT_CONVERTER: return "Extract Bank Statement Data";
      default: return "Convert Document";
    }
  };

  const getButtonColor = () => {
     switch (toolId) {
      case ToolID.PDF_TO_EXCEL: return "bg-emerald-600 hover:bg-emerald-700";
      case ToolID.PDF_TO_POWERPOINT: return "bg-orange-600 hover:bg-orange-700";
      case ToolID.PDF_OCR: return "bg-cyan-600 hover:bg-cyan-700";
      case ToolID.PDF_BANK_STATEMENT_CONVERTER: return "bg-emerald-600 hover:bg-emerald-700";
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
          accept={['application/pdf', '.pdf']}
          maxSizeInMB={50}
          onFileSelect={(f) => { setFile(f); setResult(null); }}
          label="Upload a PDF Document"
        />

        {isProcessing && (
          <div className="mt-6">
            <ProcessingProgress 
              progress={progress}
              message={toolId === ToolID.PDF_BANK_STATEMENT_CONVERTER 
                ? "Extracting bank statement data with AI..." 
                : "Processing PDF with AI..."
              }
            />
          </div>
        )}

        {file && !result && !isProcessing && (
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
                        <span className="ml-2 text-sm text-slate-700 font-medium group-hover:text-doc-slate">Markdown</span>
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

        {result && (
          <>
            <ResultDisplay 
              title={toolId === ToolID.PDF_TO_EXCEL ? "Extracted CSV Data" : toolId === ToolID.PDF_TO_POWERPOINT ? "Generated Slide Outline" : toolId === ToolID.PDF_BANK_STATEMENT_CONVERTER ? "Extracted Bank Statement Data" : "Extracted Content"} 
              content={result}
              isCode={toolId === ToolID.PDF_TO_EXCEL} 
            />
            
            {(toolId === ToolID.PDF_TO_EXCEL || toolId === ToolID.PDF_BANK_STATEMENT_CONVERTER) && (
               <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleDownloadCsv}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    icon={<Download size={18} />}
                  >
                    Download .CSV
                  </Button>
                  {downloadUrl && (
                    <a 
                      href={downloadUrl} 
                      download={`converted_data.csv`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                      title="Right-click and select 'Save link as...' if direct download doesn't work"
                    >
                      <Link size={18} className="mr-2" />
                      Alternative Download
                    </a>
                  )}
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
                  {downloadUrl && (
                    <a 
                      href={downloadUrl} 
                      download={`presentation_outline.md`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                      title="Right-click and select 'Save link as...' if direct download doesn't work"
                    >
                      <Link size={18} className="mr-2" />
                      Alternative Download
                    </a>
                  )}
               </div>
            )}

            {toolId === ToolID.PDF_OCR && (
               <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleDownloadPdf}
                    className="bg-cyan-600 hover:bg-cyan-700"
                    icon={<Download size={18} />}
                  >
                    Download Searchable PDF
                  </Button>
                  {result && (
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        try {
                          const doc = new jsPDF();
                          const pageWidth = doc.internal.pageSize.getWidth();
                          const pageHeight = doc.internal.pageSize.getHeight();
                          const margin = 20;
                          const maxWidth = pageWidth - (margin * 2);
                          
                          doc.setFont("helvetica");
                          doc.setFontSize(12);
                          
                          const splitText = doc.splitTextToSize(result, maxWidth);
                          let y = margin;
                          const lineHeight = 7;
                          
                          splitText.forEach((line: string) => {
                            if (y > pageHeight - margin) {
                              doc.addPage();
                              y = margin;
                            }
                            doc.text(line, margin, y);
                            y += lineHeight;
                          });
                          
                          const pdfData = doc.output('blob');
                          const url = URL.createObjectURL(pdfData);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'searchable_document.pdf';
                          a.click();
                          setTimeout(() => URL.revokeObjectURL(url), 100);
                        } catch (error) {
                          console.error('Alternative download failed:', error);
                          alert('Alternative download failed. Please try the main download button.');
                        }
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                      title="Right-click and select 'Save link as...' if direct download doesn't work"
                    >
                      <Link size={18} className="mr-2" />
                      Alternative Download
                    </a>
                  )}
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};