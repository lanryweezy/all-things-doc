import React, { useState } from 'react';
import { ArrowLeft, Download, RefreshCcw, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { convertImage } from '../../services/imageService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface ImageConverterProps {
  onBack: () => void;
}

export const ImageConverter: React.FC<ImageConverterProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Small delay to allow UI to update
      await new Promise(r => setTimeout(r, 500));
      const mimeType = `image/${targetFormat}` as 'image/jpeg' | 'image/png' | 'image/webp';
      const url = await convertImage(file, mimeType);
      setResultUrl(url);
    } catch (error) {
      console.error(error);
      alert('Failed to convert image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultUrl(null);
  };

  const toolInfo = TOOLS[ToolID.IMAGE_CONVERTER];

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
        {!resultUrl ? (
          <div className="space-y-6">
            <FileUpload 
              accept="image/*"
              selectedFile={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              label="Upload an image (JPG, PNG, WEBP)"
            />

            {file && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-doc-slate mb-2">
                      Convert to
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['jpeg', 'png', 'webp'].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setTargetFormat(fmt as 'jpeg' | 'png' | 'webp')}
                          className={`
                            py-3 px-4 rounded-lg text-sm font-semibold uppercase transition-all
                            ${targetFormat === fmt 
                              ? 'bg-doc-slate text-white shadow-md transform scale-105' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          {fmt === 'jpeg' ? 'JPG' : fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={handleConvert} 
                    isLoading={isProcessing}
                    className="w-full md:w-auto min-w-[140px]"
                    icon={<RefreshCcw size={18} />}
                  >
                    Convert
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-doc-slate mb-2">Conversion Complete!</h2>
            <p className="text-slate-500 mb-8">Your image is ready to download.</p>
            
            <div className="flex justify-center space-x-4">
               <Button 
                onClick={handleReset} 
                variant="outline"
              >
                Convert Another
              </Button>
              <a 
                href={resultUrl} 
                download={`converted-image.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-doc-red text-white hover:bg-[#c0392b] shadow-sm hover:shadow"
              >
                <Download size={18} className="mr-2" /> Download Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};