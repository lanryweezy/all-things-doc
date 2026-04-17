import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface RegexTesterProps {
  onBack: () => void;
}

export const RegexTester: React.FC<RegexTesterProps> = ({ onBack }) => {
  const [regex, setRegex] = useState('([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+)');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@allthingsdoc.com or info@example.org');

  const toolInfo = TOOLS[ToolID.REGEX_TESTER];

  const results = useMemo(() => {
    if (!regex) return { matches: [], error: null };
    try {
      const re = new RegExp(regex, flags);
      const matches = Array.from(testText.matchAll(re));
      return { matches, error: null };
    } catch (err) {
      return { matches: [], error: (err as Error).message };
    }
  }, [regex, flags, testText]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-6 flex-shrink-0 flex items-center space-x-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
          <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
      </div>

      <div className="flex-grow flex flex-col space-y-6 min-h-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 flex-shrink-0">
          <div className="flex gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Regular Expression</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-mono">/</div>
                <input
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  className="w-full pl-6 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none font-mono"
                  placeholder="enter regex..."
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 font-mono">/</div>
              </div>
            </div>
            <div className="w-24">
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Flags</label>
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-full py-3 text-center bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none font-mono"
                placeholder="gim"
              />
            </div>
          </div>

          {results.error && (
            <div className="flex items-center text-cyan-500 text-sm bg-cyan-50 p-3 rounded-lg border border-cyan-100">
              <AlertCircle size={16} className="mr-2" />
              {results.error}
            </div>
          )}
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Test String</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none font-mono text-sm"
              placeholder="Enter text to test against..."
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider">Matches ({results.matches.length})</label>
            </div>
            <div className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl overflow-y-auto p-4 space-y-2">
              {results.matches.map((match, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group">
                  <code className="text-cyan-600 font-bold break-all">{match[0]}</code>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Pos: {match.index}</span>
                </div>
              ))}
              {results.matches.length === 0 && !results.error && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <Search size={32} className="mb-2 opacity-20" />
                  <span className="text-sm font-medium">No matches found</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
