import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize, Copy, Check, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { FileUpload } from '../ui/FileUpload';
import { downloadBlob } from '../../utils/downloadUtils';

interface ImageResizerProps {
  onBack: () => void;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolID.IMAGE_RESIZER];

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(file);
    } else {
      setOriginalWidth(0);
      setOriginalHeight(0);
      setWidth(0);
      setHeight(0);
      setResizedBlob(null);
      setPreviewUrl(null);
    }
  }, [file]);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalWidth > 0) {
      setHeight(Math.round((newWidth / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalHeight > 0) {
      setWidth(Math.round((newHeight / originalHeight) * originalWidth));
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(blob => {
        if (blob) {
          setResizedBlob(blob);
          setPreviewUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, file.type);

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resizedBlob && file) {
      downloadBlob(resizedBlob, `resized-${file.name}`);
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        {!resizedBlob ? (
          <>
            <FileUpload
              accept="image/*"
              selectedFile={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              label="Upload Image to Resize"
            />

            {file && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={e => handleWidthChange(parseInt(e.target.value) || 0)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={e => handleHeightChange(parseInt(e.target.value) || 0)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-3 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={() => setMaintainAspectRatio(!maintainAspectRatio)}
                      className="w-5 h-5 rounded border-slate-300 text-doc-red focus:ring-doc-red cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Maintain Aspect Ratio
                    </span>
                  </label>

                  <Button
                    onClick={handleResize}
                    isLoading={isProcessing}
                    className="w-full bg-doc-slate hover:bg-slate-800"
                    icon={<Maximize size={18} />}
                  >
                    Resize Image
                  </Button>
                </div>

                <div className="flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-4">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Original"
                    className="max-w-full max-h-[300px] rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block p-4 bg-green-50 rounded-2xl border border-green-100 mb-4">
              <img
                src={previewUrl!}
                alt="Resized"
                className="max-w-full max-h-[400px] rounded-lg shadow-md"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setResizedBlob(null)} variant="outline">
                Resize Again
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-doc-red hover:bg-red-700"
                icon={<Download size={18} />}
              >
                Download Resized Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
