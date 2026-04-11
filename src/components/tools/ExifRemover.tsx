import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Download, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import piexif from 'piexifjs';
import { downloadBlob } from '../../utils/downloadUtils';

interface ExifRemoverProps {
  onBack: () => void;
}

export const ExifRemover: React.FC<ExifRemoverProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const toolInfo = TOOLS[ToolID.EXIF_REMOVER];

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          // piexif.remove strips the exif from the data URL
          const cleanDataUrl = piexif.remove(dataUrl);

          // Convert data URL back to Blob
          const byteString = atob(cleanDataUrl.split(',')[1]);
          const mimeString = cleanDataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          setResultBlob(blob);
          setIsProcessing(false);
        } catch (err) {
          console.error(err);
          alert('Error removing metadata. Ensure it is a valid JPEG image.');
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob && file) {
      downloadBlob(resultBlob, `clean-${file.name}`);
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
        {!resultBlob ? (
          <>
            <FileUpload
              accept="image/jpeg"
              selectedFile={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              label="Upload JPEG Image to Strip Metadata"
            />
            {file && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleProcess}
                  isLoading={isProcessing}
                  className="bg-red-600 hover:bg-red-700 min-w-[200px]"
                  icon={<Trash2 size={18} />}
                >
                  Remove Metadata
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-doc-slate mb-2">Metadata Removed!</h2>
              <p className="text-slate-500">Your image is now cleaner and safer to share.</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setResultBlob(null)} variant="outline">
                Clean Another
              </Button>
              <Button onClick={handleDownload} className="bg-emerald-600" icon={<Download size={18} />}>
                Download Protected Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
