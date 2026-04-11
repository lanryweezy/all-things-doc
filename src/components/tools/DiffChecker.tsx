import React, { useState } from 'react';
import { ArrowLeft, GitCompare, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { diffLines, Change } from 'diff';

interface DiffCheckerProps {
  onBack: () => void;
}

export const DiffChecker: React.FC<DiffCheckerProps> = ({ onBack }) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<Change[] | null>(null);

  const toolInfo = TOOLS[ToolID.DIFF_CHECKER];

  const handleCompare = () => {
    const changes = diffLines(text1, text2);
    setDiffResult(changes);
  };

  const handleReset = () => {
    setText1('');
    setText2('');
    setDiffResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)]">
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

        {diffResult && (
          <Button onClick={handleReset} variant="outline" icon={<RotateCcw size={18} />}>
            New Comparison
          </Button>
        )}
      </div>

      {!diffResult ? (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Original Text</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-doc-red outline-none resize-none font-mono text-sm"
              placeholder="Paste original version..."
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Changed Text</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-doc-red outline-none resize-none font-mono text-sm"
              placeholder="Paste modified version..."
            />
          </div>
        </div>
      ) : (
        <div className="flex-grow bg-white border border-slate-200 rounded-2xl overflow-y-auto p-6 font-mono text-sm leading-relaxed">
          {diffResult.map((part, index) => (
            <div
              key={index}
              className={`px-2 whitespace-pre-wrap ${
                part.added ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
                part.removed ? 'bg-red-50 text-red-700 border-l-4 border-red-500 line-through' :
                'text-slate-600'
              }`}
            >
              {part.value}
            </div>
          ))}
        </div>
      )}

      {!diffResult && (
        <div className="mt-6 flex justify-center flex-shrink-0">
          <Button
            onClick={handleCompare}
            disabled={!text1.trim() && !text2.trim()}
            className="bg-doc-slate hover:bg-slate-800 min-w-[200px]"
            icon={<GitCompare size={18} />}
          >
            Compare Text
          </Button>
        </div>
      )}
    </div>
  );
};
