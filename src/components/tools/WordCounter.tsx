import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Type,
  Hash,
  AlignLeft,
  BarChart3,
  Beaker,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';

interface WordCounterProps {
  onBack: () => void;
}

export const WordCounter: React.FC<WordCounterProps> = ({ onBack }) => {
  const [input, setInput] = useState('');

  const toolInfo = TOOLS[ToolID.WORD_COUNTER];

  const loadSample = () => {
    setInput(
      'The quick brown fox jumps over the lazy dog. This is a sample sentence to demonstrate the word counter tool. It counts words, characters, sentences, and paragraphs in real-time as you type.'
    );
  };

  const stats = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { words: 0, chars: 0, sentences: 0, paragraphs: 0, avgWordLen: 0 };

    const words = trimmed.split(/\s+/).filter(Boolean);
    const sentences = trimmed.split(/[.!?]+/).filter(Boolean);
    const paragraphs = trimmed.split(/\n+/).filter(Boolean);
    const avgWordLen = words.length
      ? (words.reduce((acc, w) => acc + w.length, 0) / words.length).toFixed(1)
      : 0;

    return {
      words: words.length,
      chars: input.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLen,
    };
  }, [input]);

  return (
    <div className="max-w-4xl mx-auto">
      <SeoHelmet tool={toolInfo} />
      <div className="mb-8 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Words', value: stats.words, icon: AlignLeft, color: 'text-blue-600' },
            { label: 'Characters', value: stats.chars, icon: Hash, color: 'text-indigo-600' },
            {
              label: 'Sentences',
              value: stats.sentences,
              icon: BarChart3,
              color: 'text-emerald-600',
            },
            {
              label: 'Paragraphs',
              value: stats.paragraphs,
              icon: BarChart3,
              color: 'text-rose-600',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <stat.icon size={16} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400">Content</span>
            <button
              onClick={loadSample}
              className="text-xs font-bold text-cyan-600 hover:underline flex items-center"
            >
              <Beaker size={14} className="mr-1" /> Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none leading-relaxed"
            placeholder="Start typing or paste your text here..."
          />
          <div className="mt-4 flex justify-between items-center text-sm text-slate-500 font-medium">
            <div>
              Reading Time:{' '}
              <span className="text-slate-900 font-bold">{Math.ceil(stats.words / 200)} min</span>
            </div>
            <div>
              Average Word Length:{' '}
              <span className="text-slate-900 font-bold">{stats.avgWordLen}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-8">
          <div
            className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => (window.location.href = '/tools/text-ai/grammar-polish')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Next Step?
                </p>
                <p className="text-sm text-slate-700 font-bold">Polish Your Writing</p>
              </div>
            </div>
          </div>

          <div
            className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => (window.location.href = '/tools/privacy-redactor')}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Shield className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Privacy Check
                </p>
                <p className="text-sm text-slate-700 font-bold">Redact Sensitive Info</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AboutTool toolId={ToolID.WORD_COUNTER} />
    </div>
  );
};
