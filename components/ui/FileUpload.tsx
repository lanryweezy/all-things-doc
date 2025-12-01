import React, { useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label?: string;
  selectedFile?: File | null;
  onClear?: () => void;
  processingProgress?: number;
  capture?: boolean | 'user' | 'environment';
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept, 
  label = "Upload a file",
  selectedFile,
  onClear,
  processingProgress,
  capture
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 animate-fade-in relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 text-doc-red rounded-lg flex-shrink-0 flex items-center justify-center">
            <FileIcon size={24} />
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <div className="mr-4">
                <p className="font-semibold text-doc-slate truncate max-w-[200px] md:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              
              {onClear && typeof processingProgress !== 'number' && (
                <button 
                  onClick={onClear}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {typeof processingProgress === 'number' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                   <span>
                     {processingProgress < 30 ? "Uploading..." : 
                      processingProgress < 70 ? "Processing with AI..." : 
                      "Finalizing..."}
                   </span>
                   <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                   <div 
                      className="bg-doc-red h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${processingProgress}%` }}
                   />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl p-10 cursor-pointer text-center transition-all duration-200
        flex flex-col items-center justify-center min-h-[200px]
        ${isDragging 
          ? 'border-doc-red bg-red-50 scale-[1.01]' 
          : 'border-slate-300 hover:border-red-300 hover:bg-slate-50'
        }
      `}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleChange}
        capture={capture}
      />
      <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-red-100 text-doc-red' : 'bg-slate-100 text-slate-500'}`}>
        <UploadCloud size={32} />
      </div>
      <p className="text-lg font-medium text-doc-slate mb-1">{label}</p>
      <p className="text-sm text-slate-500">or drag and drop here</p>
    </div>
  );
};