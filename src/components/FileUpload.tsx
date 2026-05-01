import React, { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string | string[];
  maxSizeInMB?: number;
  className?: string;
  label?: string;
  selectedFile?: File | null;
  onClear?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = [],
  maxSizeInMB = 50,
  className = '',
  label = 'Choose file or drag and drop',
  selectedFile: controlledFile,
  onClear: controlledClear,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const [internalFile, setInternalFile] = useState<File | null>(null);

  const isControlled = controlledFile !== undefined;
  const selectedFile = isControlled ? controlledFile : internalFile;

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSizeInBytes) {
        return `File size exceeds ${maxSizeInMB}MB limit`;
      }

      // Check file type if specified
      const acceptedTypes = Array.isArray(accept) ? accept : accept.split(',').map(t => t.trim());

      if (acceptedTypes.length > 0 && acceptedTypes[0] !== '' && acceptedTypes[0] !== '*/*') {
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
    },
    [maxSizeInBytes, maxSizeInMB, accept]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        if (!isControlled) setInternalFile(null);
        return;
      }

      setError('');
      if (!isControlled) setInternalFile(file);
      onFileSelect(file);
    },
    [onFileSelect, validateFile, isControlled]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

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
          ${
            isDragOver
              ? 'border-cyan-600 bg-cyan-50'
              : error
                ? 'border-cyan-500 bg-cyan-50'
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
                  {Array.isArray(accept) && accept.length > 0 && accept[0] !== ''
                    ? `Accepted: ${accept.join(', ')}`
                    : typeof accept === 'string' && accept !== '' && accept !== '*/*'
                      ? `Accepted: ${accept}`
                      : 'All file types accepted'}
                  {maxSizeInMB && ` • Max ${maxSizeInMB}MB`}
                </p>
              </div>
            )}
          </div>

          {!selectedFile && (
            <label className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                <File className="w-4 h-4 mr-2" />
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept={Array.isArray(accept) ? accept.join(',') : accept}
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
            if (isControlled && controlledClear) {
              controlledClear();
            } else {
              setInternalFile(null);
            }
            setError('');
          }}
          className="mt-2 text-sm text-cyan-600 hover:text-cyan-700"
        >
          Remove file
        </button>
      )}
    </div>
  );
};
