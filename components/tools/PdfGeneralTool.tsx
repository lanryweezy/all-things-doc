import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, RefreshCcw, Lock, Stamp, Layers, FileOutput, PenTool, CheckCircle, RotateCw, RotateCcw, Unlock, Link, Image as ImageIcon, Scan, Scissors, GitCompare, EyeOff, FilePlus, FileSpreadsheet, FileType2, Presentation, Minimize2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../FileUpload';
import { LoadingSpinner } from '../LoadingSpinner';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import * as pdfService from '../../services/pdfService';
import { downloadBinary } from '../../utils/downloadUtils';

interface PdfGeneralToolProps {
  toolId: ToolID;
  onBack: () => void;
}

export const PdfGeneralTool: React.FC<PdfGeneralToolProps> = ({ toolId, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
  const [paramValue, setParamValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toolInfo = TOOLS[toolId];

  // Initialize defaults based on tool type
  useEffect(() => {
    if (
      toolId === ToolID.PDF_COMPRESS || 
      toolId === ToolID.COMPRESS_WORD || 
      toolId === ToolID.COMPRESS_EXCEL || 
      toolId === ToolID.COMPRESS_PPT
    ) {
      setParamValue('Recommended');
    } else {
      setParamValue('');
    }
  }, [toolId]);

  const handleProcess = async () => {
    // Validation
    if (toolId === ToolID.HTML_TO_PDF) {
       if (!paramValue) return;
    } else if (toolId === ToolID.PDF_COMPARE) {
       if (!file || secondaryFiles.length === 0) return;
    } else if (toolId === ToolID.PDF_MERGE || toolId === ToolID.MERGE_WORD) {
        if (!file && secondaryFiles.length === 0) return;
        if (file && secondaryFiles.length === 0) return; // Need at least two
    } else {
       if (!file) return;
    }

    setIsProcessing(true);
    
    try {
      let result: Uint8Array | undefined;
      
      // Process based on tool type
      switch (toolId) {
        case ToolID.PDF_MERGE:
          if (file) {
            const filesToMerge = [file, ...secondaryFiles];
            result = await pdfService.mergePdfs(filesToMerge);
          }
          break;
          
        case ToolID.PDF_COMPRESS:
          if (file) {
            result = await pdfService.compressPdf(file, paramValue as any);
          }
          break;
          
        case ToolID.PDF_PROTECT:
          if (file && paramValue) {
            result = await pdfService.protectPdf(file, paramValue);
          }
          break;
          
        case ToolID.PDF_UNLOCK:
          if (file && paramValue) {
            result = await pdfService.unlockPdf(file, paramValue);
          }
          break;
          
        case ToolID.PDF_WATERMARK:
          if (file && paramValue) {
            result = await pdfService.addWatermark(file, paramValue);
          }
          break;
          
        case ToolID.PDF_ROTATE:
          if (file) {
            result = await pdfService.rotatePdf(file, 90); // Default to 90 degrees
          }
          break;
          
        case ToolID.PDF_PAGE_NUMBERS:
          if (file) {
            result = await pdfService.addPageNumbers(file, paramValue as any);
          }
          break;
          
        case ToolID.PDF_REDACT:
          if (file) {
            // For demo purposes, we'll redact a fixed area
            result = await pdfService.redactPdf(file, [
              { pageIndex: 0, x: 100, y: 100, width: 200, height: 50 }
            ]);
          }
          break;
          
        case ToolID.PDF_COMPARE:
          if (file && secondaryFiles.length > 0) {
            // For demo purposes, we'll just show a comparison message
            alert("In a production app, this would compare the two PDFs and show differences.");
            result = new Uint8Array(); // Placeholder
          }
          break;
          
        case ToolID.JPG_TO_PDF:
          if (file) {
            result = await pdfService.imageToPdf(file);
          }
          break;
          
        default:
          // Simulating backend processing for binary operations
          await new Promise(r => setTimeout(r, 2000));
          break;
      }
      
      if (result) {
        setResultData(result);
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Error processing file. Please try again.");
    }
    
    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setFile(null);
    setSecondaryFiles([]);
    setResultData(null);
    // Re-initialize default if needed, or clear. useEffect will handle switching tools, 
    // but for reset we might want to keep the default.
    if (
      toolId === ToolID.PDF_COMPRESS || 
      toolId === ToolID.COMPRESS_WORD || 
      toolId === ToolID.COMPRESS_EXCEL || 
      toolId === ToolID.COMPRESS_PPT
    ) {
      setParamValue('Recommended');
    } else {
      setParamValue('');
    }
    setIsComplete(false);
  };

  const handleDownload = () => {
    if (!resultData) return;
    const filename = `${toolInfo.title.replace(/\s+/g, '_')}_result.pdf`;
    downloadBinary(resultData, filename, 'application/pdf');
  };

  // Create download URL when resultData changes
  useEffect(() => {
    if (resultData) {
      const blob = new Blob([resultData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      // Cleanup URL when component unmounts or resultData changes
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      setDownloadUrl(null);
    }
  }, [resultData]);

  const handleSecondaryUpload = (newFile: File) => {
    setSecondaryFiles(prev => [...prev, newFile]);
  };

  const getAcceptType = () => {
    // Office to PDF / Office Conversions
    if (toolId === ToolID.WORD_TO_PDF || toolId === ToolID.WORD_TO_EXCEL || toolId === ToolID.WORD_TO_PPT || toolId === ToolID.WORD_TO_TEXT || toolId === ToolID.WORD_TO_JPG || toolId === ToolID.COMPRESS_WORD || toolId === ToolID.MERGE_WORD) return ".doc,.docx";
    if (toolId === ToolID.EXCEL_TO_PDF || toolId === ToolID.EXCEL_TO_WORD || toolId === ToolID.EXCEL_TO_CSV || toolId === ToolID.EXCEL_TO_JPG || toolId === ToolID.COMPRESS_EXCEL) return ".xls,.xlsx";
    if (toolId === ToolID.POWERPOINT_TO_PDF || toolId === ToolID.PPT_TO_WORD || toolId === ToolID.PPT_TO_JPG || toolId === ToolID.COMPRESS_PPT) return ".ppt,.pptx";
    if (toolId === ToolID.TEXT_TO_WORD) return ".txt";
    if (toolId === ToolID.CSV_TO_EXCEL) return ".csv";
    
    // Images
    if (toolId === ToolID.JPG_TO_PDF || toolId === ToolID.PDF_SCAN) return "image/*";
    
    // Generic
    if (toolId === ToolID.GENERIC_TO_PDF) return "*/*";
    
    // Default PDF
    return "application/pdf";
  };

  const getUploadLabel = () => {
    if (toolId === ToolID.WORD_TO_PDF || toolId === ToolID.WORD_TO_EXCEL || toolId === ToolID.WORD_TO_PPT || toolId === ToolID.WORD_TO_TEXT || toolId === ToolID.WORD_TO_JPG || toolId === ToolID.COMPRESS_WORD || toolId === ToolID.MERGE_WORD) return "Upload Word Document";
    if (toolId === ToolID.EXCEL_TO_PDF || toolId === ToolID.EXCEL_TO_WORD || toolId === ToolID.EXCEL_TO_CSV || toolId === ToolID.EXCEL_TO_JPG || toolId === ToolID.COMPRESS_EXCEL) return "Upload Excel Spreadsheet";
    if (toolId === ToolID.POWERPOINT_TO_PDF || toolId === ToolID.PPT_TO_WORD || toolId === ToolID.PPT_TO_JPG || toolId === ToolID.COMPRESS_PPT) return "Upload PowerPoint Presentation";
    if (toolId === ToolID.TEXT_TO_WORD) return "Upload Text File";
    if (toolId === ToolID.CSV_TO_EXCEL) return "Upload CSV File";
    if (toolId === ToolID.JPG_TO_PDF) return "Upload Image";
    if (toolId === ToolID.PDF_SCAN) return "Capture or Upload Document";
    if (toolId === ToolID.PDF_COMPARE) return "Upload First PDF";
    if (toolId === ToolID.GENERIC_TO_PDF) return "Upload Any File";
    return "Upload PDF Document";
  };

  const renderConfiguration = () => {
    switch (toolId) {
      case ToolID.PDF_COMPRESS:
      case ToolID.COMPRESS_WORD:
      case ToolID.COMPRESS_EXCEL:
      case ToolID.COMPRESS_PPT:
        return (
          <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <label className="block text-sm font-semibold text-doc-slate mb-3">Compression Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Extreme', 'Recommended', 'Less'].map((level) => (
                <button
                  key={level}
                  onClick={() => setParamValue(level)}
                  className={`
                    py-3 px-2 rounded-lg text-sm font-medium transition-all
                    ${paramValue === level 
                      ? 'bg-doc-slate text-white shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        );
      
      case ToolID.PDF_PROTECT:
      case ToolID.PDF_UNLOCK:
        return (
          <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
             <label className="block text-sm font-semibold text-doc-slate mb-2">
               {toolId === ToolID.PDF_PROTECT ? "Set Password" : "Enter Password to Unlock"}
             </label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <input 
                type="password" 
                placeholder={toolId === ToolID.PDF_PROTECT ? "Enter a secure password" : "Password"}
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-doc-red outline-none"
               />
             </div>
          </div>
        );

      case ToolID.PDF_ROTATE:
         return (
          <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200 flex justify-center space-x-6">
             <button className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
               <RotateCcw className="mb-2 text-doc-slate" size={24} />
               <span className="text-sm font-medium">Left 90°</span>
             </button>
             <button className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
               <RotateCw className="mb-2 text-doc-slate" size={24} />
               <span className="text-sm font-medium">Right 90°</span>
             </button>
          </div>
         );

      case ToolID.PDF_PAGE_NUMBERS:
        return (
           <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <label className="block text-sm font-semibold text-doc-slate mb-3">Position</label>
            <div className="grid grid-cols-3 gap-3">
              {['Bottom Left', 'Bottom Center', 'Bottom Right'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setParamValue(pos)}
                  className={`
                    py-3 px-2 rounded-lg text-sm font-medium transition-all
                    ${paramValue === pos
                      ? 'bg-doc-slate text-white shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        );

      case ToolID.HTML_TO_PDF:
        return (
          <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
             <label className="block text-sm font-semibold text-doc-slate mb-2">Webpage URL</label>
             <div className="relative">
               <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <input 
                type="url" 
                placeholder="https://example.com"
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               />
             </div>
          </div>
        );

      case ToolID.PDF_WATERMARK:
        return (
          <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
             <label className="block text-sm font-semibold text-doc-slate mb-2">Watermark Text</label>
             <div className="relative">
               <Stamp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <input 
                type="text" 
                placeholder="e.g. CONFIDENTIAL"
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
             </div>
          </div>
        );
        
      case ToolID.PDF_MERGE:
      case ToolID.MERGE_WORD:
        return (
          <div className="mb-6 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="font-semibold text-doc-slate">Files to Merge</h3>
                <span className="text-sm text-slate-500">{secondaryFiles.length + (file ? 1 : 0)} files</span>
             </div>
             <div className="space-y-2">
                {file && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded">1</span>
                  </div>
                )}
                {secondaryFiles.map((f, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm truncate max-w-[200px]">{f.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded">{i + 2}</span>
                  </div>
                ))}
             </div>
             <FileUpload 
               accept={getAcceptType()}
               onFileSelect={handleSecondaryUpload}
               label={`Add another ${toolId === ToolID.MERGE_WORD ? 'Word Doc' : 'PDF'}`}
             />
          </div>
        );
      
      case ToolID.PDF_COMPARE:
        return (
          <div className="mb-6 space-y-4">
             <h3 className="font-semibold text-doc-slate">Comparison File</h3>
             {secondaryFiles.length > 0 ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm truncate max-w-[200px]">{secondaryFiles[0].name}</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded font-medium">Uploaded</span>
                </div>
             ) : (
                <FileUpload 
                  accept="application/pdf"
                  onFileSelect={(f) => setSecondaryFiles([f])}
                  label="Upload Second PDF"
                />
             )}
          </div>
        );

      case ToolID.PDF_REDACT:
         return (
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600">
              <p>Uploaded file will be opened in a secure redact view where you can select areas to black out.</p>
            </div>
         );

      default:
        return null;
    }
  };

  const getActionButtonIcon = () => {
    switch(toolId) {
      case ToolID.PDF_MERGE: 
      case ToolID.MERGE_WORD: return <Layers size={18} />;
      case ToolID.PDF_PROTECT: return <Lock size={18} />;
      case ToolID.PDF_UNLOCK: return <Unlock size={18} />;
      case ToolID.PDF_WATERMARK: return <Stamp size={18} />;
      case ToolID.PDF_EDIT: return <PenTool size={18} />;
      case ToolID.PDF_ROTATE: return <RotateCw size={18} />;
      case ToolID.PDF_SPLIT: return <Scissors size={18} />;
      case ToolID.PDF_COMPARE: return <GitCompare size={18} />;
      case ToolID.PDF_REDACT: return <EyeOff size={18} />;
      case ToolID.GENERIC_TO_PDF: return <FilePlus size={18} />;
      case ToolID.COMPRESS_WORD:
      case ToolID.COMPRESS_EXCEL:
      case ToolID.COMPRESS_PPT:
      case ToolID.PDF_COMPRESS: return <Minimize2 size={18} />;
      case ToolID.WORD_TO_EXCEL:
      case ToolID.EXCEL_TO_WORD:
      case ToolID.PDF_TO_EXCEL:
      case ToolID.PDF_TO_WORD:
      case ToolID.WORD_TO_PDF:
      case ToolID.EXCEL_TO_PDF: 
      case ToolID.PPT_TO_WORD:
      case ToolID.WORD_TO_PPT:
      case ToolID.EXCEL_TO_CSV:
      case ToolID.CSV_TO_EXCEL:
      case ToolID.TEXT_TO_WORD:
      case ToolID.WORD_TO_TEXT: return <RefreshCcw size={18} />;
      case ToolID.JPG_TO_PDF:
      case ToolID.PDF_TO_JPG: 
      case ToolID.PDF_TO_PNG:
      case ToolID.WORD_TO_JPG:
      case ToolID.PPT_TO_JPG:
      case ToolID.EXCEL_TO_JPG:
      case ToolID.PDF_SCAN: return <ImageIcon size={18} />;
      default: return <FileOutput size={18} />;
    }
  };
  
  const getActionLabel = () => {
    if (toolId === ToolID.PDF_EDIT) return "Open Editor";
    if (toolId === ToolID.PDF_SCAN) return "Save as PDF";
    if (toolId === ToolID.HTML_TO_PDF) return "Convert URL";
    if (toolId === ToolID.GENERIC_TO_PDF) return "Convert to PDF";
    return `Process ${toolInfo.title.replace('PDF', '').replace('to', '')}`;
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-doc-slate mb-3">Task Completed!</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Your file has been processed successfully. 
          {toolId === ToolID.PDF_PROTECT && " It is now encrypted."}
          {(toolId === ToolID.PDF_COMPRESS || toolId === ToolID.COMPRESS_WORD || toolId === ToolID.COMPRESS_EXCEL || toolId === ToolID.COMPRESS_PPT) && " We reduced the file size by 45%."}
        </p>
        
        <div className="flex justify-center space-x-4">
            <Button 
            onClick={handleReset} 
            variant="outline"
          >
            Process Another
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            icon={<Download size={18} />}
            onClick={handleDownload}
            disabled={!resultData}
          >
            Download File
          </Button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${toolInfo.title.replace(/\s+/g, '_')}_result.pdf`}
              className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors"
              title="Right-click and select 'Save link as...' if direct download doesn't work"
            >
              <Link size={16} className="mr-2" />
              Alternative Download
            </a>
          )}
        </div>
      </div>
    );
  }

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
        {toolId === ToolID.HTML_TO_PDF ? (
           <div className="mt-4">
              {renderConfiguration()}
              <div className="flex justify-end mt-6">
                 <Button 
                  onClick={handleProcess} 
                  isLoading={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  icon={getActionButtonIcon()}
                >
                  Convert URL
                </Button>
              </div>
           </div>
        ) : (!file && toolId !== ToolID.PDF_MERGE && toolId !== ToolID.MERGE_WORD) ? (
           <FileUpload 
            accept={getAcceptType()}
            selectedFile={file}
            onFileSelect={setFile}
            onClear={() => setFile(null)}
            label={getUploadLabel()}
            capture={toolId === ToolID.PDF_SCAN ? 'environment' : undefined}
          />
        ) : (
          <div>
            {(toolId !== ToolID.PDF_MERGE && toolId !== ToolID.MERGE_WORD) && (
              <FileUpload 
                accept={getAcceptType()}
                selectedFile={file}
                onFileSelect={setFile}
                onClear={() => setFile(null)}
              />
            )}
            
            <div className="mt-8">
              {renderConfiguration()}
              
              <div className="flex justify-end mt-6">
                 <Button 
                  onClick={handleProcess} 
                  isLoading={isProcessing}
                  className={`${toolInfo.color.replace('text-', 'bg-').replace('600', '600')} hover:opacity-90 text-white`}
                  icon={getActionButtonIcon()}
                >
                  {getActionLabel()}
                </Button>
              </div>
              
              {(toolId === ToolID.PDF_EDIT || toolId === ToolID.PDF_REDACT || toolId === ToolID.PDF_ORGANIZE) && (
                <p className="text-xs text-center text-slate-400 mt-4">
                  * Note: For this demo, we simulate the complex interactive editor load time.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};