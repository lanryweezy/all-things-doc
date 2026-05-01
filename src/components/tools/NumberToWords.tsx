import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Type, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface NumberToWordsProps {
  onBack: () => void;
}

export const NumberToWords: React.FC<NumberToWordsProps> = ({ onBack }) => {
  const [input, setInput] = useState('1234');
  const [output, setOutput] = useState('');
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.NUMBER_TO_WORDS] || {
    title: 'Number to Words',
    icon: Type,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  };

  const numberToWords = (num: number): string => {
    const a = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    const b = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
    ];

    const makeWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : '');
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + makeWords(n % 100) : '')
        );
      if (n < 1000000)
        return (
          makeWords(Math.floor(n / 1000)) +
          ' thousand' +
          (n % 1000 !== 0 ? ' ' + makeWords(n % 1000) : '')
        );
      if (n < 1000000000)
        return (
          makeWords(Math.floor(n / 1000000)) +
          ' million' +
          (n % 1000000 !== 0 ? ' ' + makeWords(n % 1000000) : '')
        );
      return 'Number too large';
    };

    if (num === 0) return 'zero';
    return makeWords(num);
  };

  useEffect(() => {
    const n = parseInt(input);
    if (!isNaN(n) && n >= 0) {
      setOutput(numberToWords(n));
    } else {
      setOutput('');
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showToast('Text copied');
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">
            Number Input
          </label>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-4xl font-black text-slate-900"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              In Words
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center"
              >
                <Copy size={14} className="mr-1" /> COPY
              </button>
            )}
          </div>
          <div className="w-full p-8 bg-indigo-50 border border-indigo-100 rounded-3xl min-h-[120px] flex items-center justify-center text-center">
            <div className="text-2xl font-bold text-indigo-900 leading-relaxed capitalize">
              {output || <span className="text-indigo-200 italic">Result will appear here...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
