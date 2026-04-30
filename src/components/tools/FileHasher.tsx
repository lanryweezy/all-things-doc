import React, { useState } from 'react';
import { ArrowLeft, Hash, File, Copy, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { FileUpload } from '../ui/FileUpload';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface FileHasherProps {
  onBack: () => void;
}

export const FileHasher: React.FC<FileHasherProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.FILE_HASHER] || {
    title: 'File Checksum (Hash)',
    icon: Hash,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  };

  const calculateHashes = async (f: File) => {
    setIsProcessing(true);
    setFile(f);
    try {
      const buffer = await f.arrayBuffer();
      const hashResults: Record<string, string> = {};
      const algorithms = ['SHA-1', 'SHA-256', 'SHA-512'];

      for (const algo of algorithms) {
        const hashBuffer = await crypto.subtle.digest(algo, buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        hashResults[algo] = hashHex;
      }

      setHashes(hashResults);
      showToast('Checksums calculated');
    } catch (err) {
      showToast('Failed to calculate hashes', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Hash copied');
  };

  const reset = () => {
    setFile(null);
    setHashes(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        {!file ? (
          <FileUpload onFileSelect={calculateHashes} label="Upload File to Generate Checksums" />
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <File size={24} className="text-slate-900" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 truncate max-w-xs">{file.name}</div>
                  <div className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-slate-400 hover:text-rose-500 font-bold text-sm flex items-center"
              >
                <RefreshCw size={14} className="mr-1" /> Change File
              </button>
            </div>

            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Calculating Hashes...
                </span>
              </div>
            ) : hashes ? (
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(hashes).map(([algo, val]) => (
                  <div key={algo} className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      {algo}
                    </label>
                    <div className="group relative">
                      <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs break-all pr-12 text-slate-900">
                        {val}
                      </div>
                      <button
                        onClick={() => handleCopy(val)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-xs text-blue-800 leading-relaxed font-medium">
              Privacy Note: Files are never uploaded to any server. Hash calculation happens 100%
              locally in your browser using the Web Crypto API.
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Hash className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Related Tool
                  </p>
                  <p className="text-sm text-indigo-700 font-medium">
                    Want to hash text instead of a file?
                  </p>
                </div>
              </div>
              <button
                onClick={() => (window.location.href = '/tools/hash-generator')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <LinkIcon size={14} className="mr-1.5" /> Text Hash Generator
              </button>
            </div>
          </div>
        )}
      </div>
      <AboutTool toolId={ToolID.FILE_HASHER} />
    </div>
  );
};
