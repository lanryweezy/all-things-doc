import React, { useState, useRef } from 'react';
import { ArrowLeft, PenTool, Download, Trash2, Eraser, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface SignatureGeneratorProps {
  onBack: () => void;
}

export const SignatureGenerator: React.FC<SignatureGeneratorProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.SIGNATURE_GENERATOR] || {
    title: 'Signature Generator',
    icon: PenTool,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a'; // doc-slate

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsEmpty(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signature.png';
      a.click();
      showToast('Signature saved as PNG');
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center space-y-8">
        <div className="w-full flex justify-between items-center px-2">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Draw below</span>
           <button onClick={clear} className="text-slate-400 hover:text-red-500 flex items-center text-xs font-bold transition-colors">
              <Eraser size={14} className="mr-1" /> CLEAR PAD
           </button>
        </div>

        <div className="w-full h-80 bg-slate-50 border-4 border-dashed border-slate-100 rounded-3xl overflow-hidden relative cursor-crosshair">
           <canvas
             ref={canvasRef}
             width={800}
             height={320}
             onMouseDown={startDrawing}
             onMouseUp={stopDrawing}
             onMouseMove={draw}
             onMouseOut={stopDrawing}
             onTouchStart={startDrawing}
             onTouchEnd={stopDrawing}
             onTouchMove={draw}
             className="w-full h-full"
           />
           <div className="absolute bottom-10 left-10 right-10 h-px bg-slate-200 pointer-events-none opacity-50"></div>
        </div>

        <div className="flex space-x-4">
           <Button onClick={download} disabled={isEmpty} className="bg-indigo-600 px-12 py-4" icon={<Download size={18} />}>
             Download PNG
           </Button>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-xs text-blue-800 leading-relaxed font-medium max-w-lg text-center">
           Generated signatures have a transparent background and are perfect for inserting into PDF documents or digital contracts. All processing is done locally.
        </div>
      </div>
    </div>
  );
};
