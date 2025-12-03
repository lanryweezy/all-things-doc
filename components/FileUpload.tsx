import React, { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  className?: string;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = [],
  maxSizeInMB = 50,
  className = '',
  label = 'Choose file or drag and drop'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSizeInMB}MB limit`;
    }

    // Check file type if specified
    if (acceptedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => {
        // Check by extension
        if (type.startsWith('.')) {
          return fileExtension === type.slice(1);
        }
        // Check by MIME type
        return mimeType.includes(type) || mimeType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${isDragOver 
            ? 'border-doc-red bg-red-50' 
            : error 
            ? 'border-red-500 bg-red-50'
            : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-slate-300 hover:border-slate-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {selectedFile ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <Upload className="w-12 h-12 text-slate-400" />
          )}
          
          <div className="text-center">
            {selectedFile ? (
              <div>
                <p className="font-medium text-green-700">{selectedFile.name}</p>
                <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-slate-700">{label}</p>
                <p className="text-sm text-slate-500">
                  {acceptedTypes.length > 0 
                    ? `Accepted: ${acceptedTypes.join(', ')}` 
                    : 'All file types accepted'
                  }
                  {maxSizeInMB && ` • Max ${maxSizeInMB}MB`}
                </p>
              </div>
            )}
          </div>

          {!selectedFile && (
            <label className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 bg-doc-red text-white rounded-lg hover:bg-red-700 transition-colors">
                <File className="w-4 h-4 mr-2" />
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept={acceptedTypes.join(',')}
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </div>
      )}

      {selectedFile && (
        <button
          onClick={() => {
            setSelectedFile(null);
            setError('');
          }}
          className="mt-2 text-sm text-doc-red hover:text-red-700"
        >
          Remove file
        </button>
      )}
    </div>
  );
};