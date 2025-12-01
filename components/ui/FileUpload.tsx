import React, { useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label?: string;
  selectedFile?: File | null;
  onClear?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept, 
  label = "Upload a file",
  selectedFile,
  onClear
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
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 text-doc-red rounded-lg flex items-center justify-center">
            <FileIcon size={24} />
          </div>
          <div>
            <p className="font-semibold text-doc-slate truncate max-w-[200px] md:max-w-md">
              {selectedFile.name}
            </p>
            <p className="text-sm text-slate-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        {onClear && (
           <button 
            onClick={onClear}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        )}
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
      />
      <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-red-100 text-doc-red' : 'bg-slate-100 text-slate-500'}`}>
        <UploadCloud size={32} />
      </div>
      <p className="text-lg font-medium text-doc-slate mb-1">{label}</p>
      <p className="text-sm text-slate-500">or drag and drop here</p>
    </div>
  );
};