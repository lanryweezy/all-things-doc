import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
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

    const getRandomWord = () => LOREM_TEXT[Math.floor(Math.random() * LOREM_TEXT.length)];

    if (type === 'words') {
      const words = startWithLorem ? ['Lorem', 'ipsum'] : [];
      while (words.length < count) words.push(getRandomWord());
      result = words.slice(0, count).join(' ') + '.';
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, (_, i) => {
        const wordCount = Math.floor(Math.random() * 10) + 8;
        const sentence = (i === 0 && startWithLorem) ? ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] : [];
        while (sentence.length < wordCount) sentence.push(getRandomWord());
        const s = sentence.join(' ');
        return s.charAt(0).toUpperCase() + s.slice(1) + '.';
      });
      result = sentences.join(' ');
    } else {
      const paragraphs = Array.from({ length: count }, (_, p) => {
        const sentenceCount = Math.floor(Math.random() * 4) + 4;
        const sentences = Array.from({ length: sentenceCount }, (_, i) => {
          const wordCount = Math.floor(Math.random() * 10) + 10;
          const sentence = (p === 0 && i === 0 && startWithLorem) ? ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] : [];
          while (sentence.length < wordCount) sentence.push(getRandomWord());
          const s = sentence.join(' ');
          return s.charAt(0).toUpperCase() + s.slice(1) + '.';
        });
        return sentences.join(' ');
      });
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
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tools
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="lorem-count" className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Count</label>
            <input
              id="lorem-count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none font-bold"
            />
          </div>
          <div>
            <label htmlFor="lorem-type" className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
            <select
              id="lorem-type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none font-bold"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <label htmlFor="start-with-lorem" className="flex items-center space-x-3 cursor-pointer group mb-1 select-none">
              <input
                id="start-with-lorem"
                type="checkbox"
                checked={startWithLorem}
                onChange={() => setStartWithLorem(!startWithLorem)}
                className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Start with "Lorem ipsum"</span>
            </label>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="lorem-output" className="sr-only">Generated Lorem Ipsum</label>
          <textarea
            id="lorem-output"
            readOnly
            value={output}
            className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none font-serif text-slate-700 leading-relaxed"
          />
          <div className="absolute right-4 top-4 flex space-x-2">
            <button
              onClick={generateText}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-cyan-600 shadow-sm transition-colors"
              title="Regenerate"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-cyan-600 shadow-sm transition-colors"
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
