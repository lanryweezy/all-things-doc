import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { ResultDisplay } from '../ui/ResultDisplay';
import { TOOLS, LANGUAGES, CODING_LANGUAGES } from '../../constants';
import { ToolID } from '../../types';
import * as GeminiService from '../../services/geminiService';

interface TextAiToolProps {
  toolId: ToolID;
  onBack: () => void;
}

export const TextAiTool: React.FC<TextAiToolProps> = ({ toolId, onBack }) => {
  const [textInput, setTextInput] = useState('');
  const [configValue, setConfigValue] = useState(''); // Stores language or secondary param
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toolInfo = TOOLS[toolId];

  // Reset state when switching tools
  useEffect(() => {
    setTextInput('');
    setResult(null);
    // Set defaults
    if (toolId === ToolID.UNIVERSAL_TRANSLATOR) setConfigValue('Spanish');
    if (toolId === ToolID.CODE_MORPH) setConfigValue('Python');
  }, [toolId]);

  const handleProcess = async () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);
    setResult(null);

    try {
      let output = '';
      switch (toolId) {
        case ToolID.MAGIC_SUMMARIZER:
          output = await GeminiService.summarizeText(textInput);
          break;
        case ToolID.UNIVERSAL_TRANSLATOR:
          output = await GeminiService.translateText(textInput, configValue);
          break;
        case ToolID.GRAMMAR_POLISH:
          output = await GeminiService.correctGrammar(textInput);
          break;
        case ToolID.CODE_MORPH:
          output = await GeminiService.convertCode(textInput, configValue);
          break;
      }
      setResult(output);
    } catch (error) {
      console.error(error);
      setResult('An error occurred while processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderConfigInput = () => {
    if (toolId === ToolID.UNIVERSAL_TRANSLATOR) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-doc-slate mb-2">Target Language</label>
          <select
            value={configValue}
            onChange={e => setConfigValue(e.target.value)}
            className="w-full md:w-64 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-doc-red outline-none"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      );
    }
    if (toolId === ToolID.CODE_MORPH) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-doc-slate mb-2">
            Convert to Language
          </label>
          <select
            value={configValue}
            onChange={e => setConfigValue(e.target.value)}
            className="w-full md:w-64 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {CODING_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-doc-slate mb-2">
              {toolId === ToolID.CODE_MORPH ? 'Paste Code Snippet' : 'Enter Text'}
            </label>
            <textarea
              className={`w-full h-48 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none resize-none font-mono text-sm ${
                toolId === ToolID.CODE_MORPH
                  ? 'focus:ring-amber-500'
                  : toolId === ToolID.UNIVERSAL_TRANSLATOR
                    ? 'focus:ring-purple-500'
                    : 'focus:ring-doc-red'
              }`}
              placeholder={
                toolId === ToolID.CODE_MORPH
                  ? "console.log('Hello World');"
                  : 'Type or paste your text here...'
              }
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-grow">{renderConfigInput()}</div>
            <Button
              onClick={handleProcess}
              isLoading={isProcessing}
              disabled={!textInput.trim()}
              className={
                toolId === ToolID.CODE_MORPH
                  ? '!bg-amber-600 hover:!bg-amber-700'
                  : toolId === ToolID.UNIVERSAL_TRANSLATOR
                    ? '!bg-purple-600 hover:!bg-purple-700'
                    : ''
              }
              icon={<Sparkles size={18} />}
            >
              {toolId === ToolID.MAGIC_SUMMARIZER
                ? 'Summarize'
                : toolId === ToolID.UNIVERSAL_TRANSLATOR
                  ? 'Translate'
                  : toolId === ToolID.CODE_MORPH
                    ? 'Convert Code'
                    : 'Polish Text'}
            </Button>
          </div>
        </div>

        {result && (
          <ResultDisplay title="Result" content={result} isCode={toolId === ToolID.CODE_MORPH} />
        )}
      </div>
    </div>
  );
};
