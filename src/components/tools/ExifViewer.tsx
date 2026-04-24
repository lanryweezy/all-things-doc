import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Info, Image as ImageIcon, Search, Download, Trash2, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { FileUpload } from '../FileUpload';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import piexif from 'piexifjs';

interface ExifViewerProps {
  onBack: () => void;
}

export const ExifViewer: React.FC<ExifViewerProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<Record<string, any> | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.EXIF_VIEWER] || {
    title: 'EXIF Viewer',
    icon: Tag,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  };

  const handleFileSelect = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      try {
        const exif = piexif.load(dataUrl);
        const simplified: Record<string, any> = {};

        for (const ifd in exif) {
          if (ifd === 'thumbnail') continue;
          for (const tag in exif[ifd]) {
            const tagName = piexif.TAGS[ifd][tag]?.name || tag;
            let val = exif[ifd][tag];
            if (Array.isArray(val) && val.length > 50) val = `[Large Data Block: ${val.length} bytes]`;
            simplified[tagName] = val;
          }
        }
        setExifData(simplified);
        showToast('Metadata extracted');
      } catch (err) {
        showToast('No EXIF data found', 'info');
        setExifData({});
      }
    };
    reader.readAsDataURL(f);
  };

  const clear = () => {
    setFile(null);
    setExifData(null);
    setPreview(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
      </div>

      {!file ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
           <FileUpload accept="image/jpeg" onFileSelect={handleFileSelect} label="Upload JPEG Image to View Metadata" />
           <p className="mt-4 text-center text-xs text-slate-400">Note: EXIF data is most common in JPEG photos from cameras/phones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-6">
               <div className="w-full flex justify-between items-center mb-6">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{file.name}</span>
                 <button onClick={clear} className="text-slate-400 hover:text-cyan-500">
                    <Trash2 size={18} />
                 </button>
               </div>
               <img src={preview!} alt="Preview" className="max-w-full max-h-[400px] rounded-2xl shadow-lg object-contain" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Metadata Values</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  {Object.keys(exifData || {}).length} Tags Found
                </span>
             </div>
             <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-slate-100 custom-scrollbar">
                {exifData && Object.keys(exifData).length > 0 ? (
                  Object.entries(exifData).map(([key, val]) => (
                    <div key={key} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start space-x-4">
                       <span className="text-xs font-bold text-slate-500 w-1/3 truncate" title={key}>{key}</span>
                       <span className="text-sm font-mono text-slate-900 text-right break-all">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center text-slate-300 italic">No EXIF tags found in this image.</div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
