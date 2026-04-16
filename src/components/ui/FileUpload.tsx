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
  label = 'Upload a file',
  selectedFile,
  onClear,
  processingProgress,
  capture,
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
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 animate-in fade-in duration-500 relative overflow-hidden transition-colors">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors">
            <FileIcon size={24} />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <div className="mr-4">
                <p className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] md:max-w-md transition-colors">
                  {selectedFile.name}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest transition-colors">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>

              {onClear && typeof processingProgress !== 'number' && (
                <button
                  onClick={onClear}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {typeof processingProgress === 'number' && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 transition-colors">
                  <span>
                    {processingProgress < 30
                      ? 'Uploading...'
                      : processingProgress < 70
                        ? 'Processing...'
                        : 'Finalizing...'}
                  </span>
                  <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 transition-colors">
                  <div
                    className="bg-cyan-600 h-full rounded-full transition-all duration-300 ease-out"
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
        border-2 border-dashed rounded-3xl p-12 cursor-pointer text-center transition-all duration-300
        flex flex-col items-center justify-center min-h-[250px]
        ${
          isDragging
            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
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
      <div
        className={`p-5 rounded-2xl mb-6 transition-colors ${isDragging ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}
      >
        <UploadCloud size={36} />
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">{label}</p>
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500 transition-colors uppercase tracking-widest">or drag and drop here</p>
    </div>
  );
};
