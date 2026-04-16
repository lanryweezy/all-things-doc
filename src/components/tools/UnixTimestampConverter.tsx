import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface UnixTimestampConverterProps {
  onBack: () => void;
}

export const UnixTimestampConverter: React.FC<UnixTimestampConverterProps> = ({ onBack }) => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState(new Date().toISOString());
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.UNIX_TIMESTAMP_CONVERTER];

  const handleTimestampChange = (val: string) => {
    setTimestamp(val);
    const ts = parseInt(val);
    if (!isNaN(ts)) {
      setDateStr(new Date(ts * 1000).toISOString());
    }
  };

  const handleDateChange = (val: string) => {
    setDateStr(val);
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
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
        <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 space-y-10">
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Unix Timestamp (Seconds)</label>
          <div className="flex space-x-4">
             <input
                type="number"
                value={timestamp}
                onChange={(e) => handleTimestampChange(e.target.value)}
                className="flex-1 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-slate-900 outline-none font-mono text-3xl font-black text-doc-slate"
             />
             <button onClick={() => handleCopy(timestamp)} className="p-4 bg-white border border-slate-200 rounded-2xl hover:text-indigo-600 shadow-sm transition-colors">
                <Copy size={24} />
             </button>
          </div>
        </div>

        <div className="flex justify-center">
           <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
              <RefreshCw size={20} />
           </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Human Readable (ISO 8601)</label>
          <div className="flex space-x-4">
             <input
                type="text"
                value={dateStr}
                onChange={(e) => handleDateChange(e.target.value)}
                className="flex-1 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-slate-900 outline-none font-mono text-lg font-bold text-doc-slate"
             />
             <button onClick={() => handleCopy(dateStr)} className="p-4 bg-white border border-slate-200 rounded-2xl hover:text-indigo-600 shadow-sm transition-colors">
                <Copy size={24} />
             </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 bg-indigo-50 rounded-2xl">
              <div className="text-xs font-bold text-indigo-400 uppercase mb-2">Local Time</div>
              <div className="text-indigo-900 font-bold">{new Date(parseInt(timestamp) * 1000).toLocaleString()}</div>
           </div>
           <div className="p-6 bg-emerald-50 rounded-2xl">
              <div className="text-xs font-bold text-emerald-400 uppercase mb-2">UTC Time</div>
              <div className="text-emerald-900 font-bold">{new Date(parseInt(timestamp) * 1000).toUTCString()}</div>
           </div>
        </div>
      </div>
    </div>
  );
};
