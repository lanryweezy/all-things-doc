import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface LoremIpsumGeneratorProps {
  onBack: () => void;
}

const LOREM_TEXT = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros', 'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus', 'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus', 'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam', 'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in', 'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque', 'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis', 'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada', 'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam', 'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat', 'donec'
];

export const LoremIpsumGenerator: React.FC<LoremIpsumGeneratorProps> = ({ onBack }) => {
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.LOREM_IPSUM_GENERATOR];

  const generateText = () => {
    let result = '';

    if (type === 'words') {
      const words = [];
      if (startWithLorem) words.push('Lorem', 'ipsum');
      while (words.length < count) {
        words.push(LOREM_TEXT[Math.floor(Math.random() * LOREM_TEXT.length)]);
      }
      result = words.slice(0, count).join(' ') + '.';
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        let sentence = [];
        const wordCount = Math.floor(Math.random() * 10) + 8;
        if (i === 0 && startWithLorem) {
          sentence.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        }
        while (sentence.length < wordCount) {
          sentence.push(LOREM_TEXT[Math.floor(Math.random() * LOREM_TEXT.length)]);
        }
        let s = sentence.join(' ');
        sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
      }
      result = sentences.join(' ');
    } else {
      const paragraphs = [];
      for (let p = 0; p < count; p++) {
        const sentences = [];
        const sentenceCount = Math.floor(Math.random() * 4) + 4;
        for (let i = 0; i < sentenceCount; i++) {
          let sentence = [];
          const wordCount = Math.floor(Math.random() * 10) + 10;
          if (p === 0 && i === 0 && startWithLorem) {
            sentence.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
          }
          while (sentence.length < wordCount) {
            sentence.push(LOREM_TEXT[Math.floor(Math.random() * LOREM_TEXT.length)]);
          }
          let s = sentence.join(' ');
          sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }

    setOutput(result);
  };

  useEffect(() => {
    generateText();
  }, [count, type, startWithLorem]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-doc-slate transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-doc-red outline-none font-bold"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-3 cursor-pointer group mb-1">
              <div
                onClick={() => setStartWithLorem(!startWithLorem)}
                className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                  startWithLorem ? 'bg-doc-red border-doc-red' : 'bg-white border-slate-200 group-hover:border-doc-red/30'
                }`}
              >
                {startWithLorem && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Start with "Lorem ipsum"</span>
            </label>
          </div>
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={output}
            className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none font-serif text-slate-700 leading-relaxed"
          />
          <div className="absolute right-4 top-4 flex space-x-2">
            <button
              onClick={generateText}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-doc-red shadow-sm transition-colors"
              title="Regenerate"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-doc-red shadow-sm transition-colors"
              title="Copy"
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
