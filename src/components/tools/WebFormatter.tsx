import React, { useState } from 'react';
import { ArrowLeft, Code, FileCode, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface WebFormatterProps {
  onBack: () => void;
}

export const WebFormatter: React.FC<WebFormatterProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'html' | 'css'>('html');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.WEB_FORMATTER] || {
    title: 'HTML/CSS Formatter',
    icon: FileCode,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  };

  const handleFormat = () => {
    try {
      let formatted = '';
      if (type === 'html') {
        formatted = formatHTML(input);
      } else {
        formatted = formatCSS(input);
      }
      setOutput(formatted);
      showToast('Formatted successfully');
    } catch (err) {
      showToast('Formatting failed. Check syntax.', 'error');
    }
  };

  const formatHTML = (html: string) => {
    let formatted = '';
    let indent = '';
    const tab = '  ';
    html.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) indent = indent.substring(tab.length);
      formatted += indent + '<' + element + '>\r\n';
      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img') && !element.startsWith('br') && !element.startsWith('hr')) indent += tab;
    });
    return formatted.substring(1, formatted.length - 3);
  };

  const formatCSS = (css: string) => {
    return css
      .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
      .replace(/\{/g, ' {\n  ')
      .replace(/\;/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/  \}/g, '}')
      .trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-doc-slate">{toolInfo.title}</h1>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl">
           {['html', 'css'].map(t => (
             <button
               key={t}
               onClick={() => setType(t as any)}
               className={`px-6 py-2 text-xs font-black uppercase rounded-lg transition-all ${type === t ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Input {type.toUpperCase()}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm resize-none"
            placeholder={`Paste messy ${type.toUpperCase()} here...`}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2 px-1">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Formatted Result</label>
             {output && (
               <button onClick={handleCopy} className="text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center">
                  {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  {copied ? 'COPIED!' : 'COPY'}
               </button>
             )}
          </div>
          <textarea
            readOnly
            value={output}
            className="flex-grow w-full p-4 bg-slate-900 text-orange-200 border border-slate-800 rounded-2xl font-mono text-sm resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-shrink-0">
         <Button onClick={handleFormat} className="bg-orange-600 px-12" icon={<RefreshCw size={18} />}>
           Format {type.toUpperCase()}
         </Button>
      </div>
    </div>
  );
};
