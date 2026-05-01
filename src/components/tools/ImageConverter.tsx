import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  RefreshCcw,
  Image as ImageIcon,
  Link,
  Maximize,
  Minimize2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { convertImage } from '../../services/imageService';
import * as pdfService from '../../services/pdfService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { downloadBinary, downloadBlob } from '../../utils/downloadUtils';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';

interface ImageConverterProps {
  onBack: () => void;
}

export const ImageConverter: React.FC<ImageConverterProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp' | 'pdf'>('png');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (resultData) {
      const blob = new Blob([resultData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else if (resultUrl) {
      setDownloadUrl(resultUrl);
    } else {
      setDownloadUrl(null);
    }
  }, [resultData, resultUrl]);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Small delay to allow UI to update
      await new Promise(r => setTimeout(r, 500));

      if (targetFormat === 'pdf') {
        // Convert image to PDF
        const pdfData = await pdfService.imageToPdf(file);
        setResultData(pdfData);
        setResultUrl(null); // We'll use resultData for PDF download
      } else {
        // Convert image to another image format
        const mimeType = `image/${targetFormat}` as 'image/jpeg' | 'image/png' | 'image/webp';
        const url = await convertImage(file, mimeType, quality);
        setResultUrl(url);
        setResultData(null); // We'll use resultUrl for image download
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to convert image', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultUrl(null);
    setResultData(null);
  };

  const handleDownload = () => {
    try {
      if (targetFormat === 'pdf' && resultData) {
        // Download PDF using utility
        const filename = `converted-image.pdf`;
        downloadBinary(resultData, filename, 'application/pdf');
      } else if (targetFormat !== 'pdf' && resultUrl) {
        // Download image using utility
        const filename = `converted-image.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
        fetch(resultUrl)
          .then(response => response.blob())
          .then(blob => downloadBlob(blob, filename))
          .catch(error => {
            console.error('Download failed:', error);
            showToast('Download failed. Please try again.', 'error');
          });
      }
    } catch (error) {
      console.error('Download failed:', error);
      showToast('Download failed. Please try again.', 'error');
    }
  };

  const toolInfo = TOOLS[ToolID.IMAGE_CONVERTER];

  return (
    <div className="max-w-4xl mx-auto">
      <SeoHelmet tool={toolInfo} />
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {!resultUrl && !resultData ? (
          <div className="space-y-6">
            <FileUpload
              accept="image/*"
              selectedFile={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              label="Upload an image (JPG, PNG, WEBP)"
            />

            {file && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in space-y-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Target Format
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {['jpeg', 'png', 'webp', 'pdf'].map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setTargetFormat(fmt as 'jpeg' | 'png' | 'webp' | 'pdf')}
                          className={`
                            py-3 px-4 rounded-lg text-sm font-semibold uppercase transition-all
                            ${
                              targetFormat === fmt
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          {fmt === 'jpeg' ? 'JPG' : fmt === 'pdf' ? 'PDF' : fmt}
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

                {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <label
                        htmlFor="quality-slider"
                        className="text-sm font-medium text-slate-700"
                      >
                        Image Quality / Compression
                      </label>
                      <span className="text-sm font-bold text-cyan-600">
                        {Math.round(quality * 100)}%
                      </span>
                    </div>
                    <input
                      id="quality-slider"
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={quality}
                      onChange={e => setQuality(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 italic">
                      <span>Smaller size, lower quality</span>
                      <span>Best quality, larger size</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Conversion Complete!</h2>
            <p className="text-slate-500 mb-8">
              Your {targetFormat === 'pdf' ? 'PDF' : 'image'} is ready to download.
            </p>

            <div className="flex justify-center space-x-4 mb-8">
              <Button onClick={handleReset} variant="outline">
                Convert Another
              </Button>
              <Button
                onClick={handleDownload}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-cyan-600 text-white hover:bg-[#c0392b] shadow-sm hover:shadow"
              >
                <Download size={18} className="mr-2" /> Download{' '}
                {targetFormat === 'pdf' ? 'PDF' : 'Image'}
              </Button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`converted-image.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                  title="Right-click and select 'Save link as...' if direct download doesn't work"
                >
                  <Link size={18} className="mr-2" />
                  Alternative Download
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => (window.location.href = '/tools/image-resizer')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Maximize className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Next Step?
                    </p>
                    <p className="text-sm text-slate-700 font-bold">Resize this Image</p>
                  </div>
                </div>
              </div>

              <div
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => (window.location.href = '/tools/image-compressor')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Minimize2 className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Next Step?
                    </p>
                    <p className="text-sm text-slate-700 font-bold">Compress Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AboutTool toolId={ToolID.IMAGE_CONVERTER} />
    </div>
  );
};
