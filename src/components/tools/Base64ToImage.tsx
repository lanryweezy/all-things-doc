import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Download, Copy, Check, Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface Base64ToImageProps {
  onBack: () => void;
}

export const Base64ToImage: React.FC<Base64ToImageProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.BASE64_TO_IMAGE];

  const handleProcess = () => {
    try {
      let src = input.trim();
      if (!src.startsWith('data:image')) {
        // Try to guess mime type or default to png
        if (src.startsWith('/9j/')) src = 'data:image/jpeg;base64,' + src;
        else if (src.startsWith('iVBORw0KGgo')) src = 'data:image/png;base64,' + src;
        else src = 'data:image/png;base64,' + src;
      }
      setImgUrl(src);
      showToast('Image decoded');
    } catch (e) {
      showToast('Invalid Base64 string', 'error');
    }
  };

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = 'decoded_image';
    a.click();
  };

  const handleClear = () => {
    setInput('');
    setImgUrl(null);
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
        {!imgUrl ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Base64 String
              </label>
              {input && (
                <button
                  onClick={handleClear}
                  className="text-slate-400 hover:text-cyan-500 text-xs font-bold flex items-center"
                >
                  <Trash2 size={14} className="mr-1" /> CLEAR
                </button>
              )}
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs text-slate-600 resize-none"
              placeholder="Paste data:image/... or raw base64 string here..."
            />
            <div className="flex justify-center">
              <Button
                onClick={handleProcess}
                disabled={!input.trim()}
                className="bg-blue-600 px-12"
                icon={<ImageIcon size={18} />}
              >
                Decode to Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Decoded Preview
              </h3>
              <button
                onClick={handleClear}
                className="text-blue-600 hover:text-blue-700 text-sm font-bold"
              >
                Try another string
              </button>
            </div>

            <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[300px] p-10 group relative">
              <img
                src={imgUrl}
                alt="Decoded"
                className="max-w-full max-h-[500px] shadow-2xl rounded-lg group-hover:scale-[1.02] transition-transform"
              />
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleDownload}
                className="bg-emerald-600 px-8"
                icon={<Download size={18} />}
              >
                Download Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
