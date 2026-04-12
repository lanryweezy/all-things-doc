import React, { useState, useCallback } from 'react';
import { ArrowLeft, Crop as CropIcon, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import Cropper from 'react-easy-crop';
import { downloadBlob } from '../../utils/downloadUtils';

interface ImageCropperProps {
  onBack: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolID.IMAGE_CROPPER];

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setImageSrc(URL.createObjectURL(f));
    setResultBlob(null);
  };

  const getCroppedImg = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx?.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          setResultBlob(blob);
          setPreviewUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      downloadBlob(resultBlob, 'cropped-image.png');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {!imageSrc ? (
          <FileUpload accept="image/*" onFileSelect={handleFileSelect} label="Upload Image to Crop" />
        ) : !resultBlob ? (
          <div className="space-y-6">
            <div className="relative h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={aspect === 1 ? 'round' : 'rect'}
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-grow w-full space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Free', val: undefined },
                    { label: '1:1', val: 1 },
                    { label: '4:3', val: 4 / 3 },
                    { label: '16:9', val: 16 / 9 },
                    { label: 'Circle', val: 1 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setAspect(preset.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        aspect === preset.val && preset.label !== 'Circle'
                          ? 'bg-doc-red text-white border-doc-red'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-bold text-slate-500 mb-2 uppercase">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-doc-red"
                />
              </div>
              <Button onClick={getCroppedImg} isLoading={isProcessing} className="w-full md:w-auto min-w-[150px]" icon={<CropIcon size={18} />}>
                Crop Image
              </Button>
              <Button onClick={() => { setImageSrc(null); setFile(null); }} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <img src={previewUrl!} alt="Cropped" className="max-w-full max-h-[400px] mx-auto rounded-lg shadow-md border border-slate-100" />
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setResultBlob(null)} variant="outline">Crop Again</Button>
              <Button onClick={handleDownload} className="bg-emerald-600" icon={<Download size={18} />}>
                Download Cropped Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
