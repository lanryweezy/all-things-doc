import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, Copy, Check, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface SpeechToTextProps {
  onBack: () => void;
}

export const SpeechToText: React.FC<SpeechToTextProps> = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toolInfo = TOOLS[ToolID.SPEECH_TO_TEXT];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimText = '';
        let finalizedText = transcript;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalizedText += (finalizedText ? ' ' : '') + text;
          } else {
            interimText += text;
          }
        }
        setTranscript(finalizedText);
        setInterimTranscript(interimText);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  if (!recognitionRef.current && typeof window !== 'undefined') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-doc-slate mb-4">Browser Not Supported</h2>
        <p className="text-slate-600">Your browser does not support the Speech Recognition API. Please try using Chrome or Edge.</p>
        <Button onClick={onBack} className="mt-6">Back to Tools</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
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
      </div>

      <div className="flex-grow bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col relative overflow-hidden">
        <div className="flex-grow overflow-y-auto font-medium text-lg leading-relaxed text-slate-700 custom-scrollbar">
          {transcript}
          <span className="text-slate-400 italic"> {interimTranscript}</span>
          {!transcript && !interimTranscript && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <Mic size={48} className="mb-4 opacity-20" />
              <p>Click the microphone and start speaking...</p>
            </div>
          )}
        </div>

        {isListening && (
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Listening</span>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center space-x-6">
          <button
            onClick={handleReset}
            className="p-4 text-slate-400 hover:text-cyan-600 transition-colors"
            title="Clear text"
          >
            <RefreshCcw size={24} />
          </button>

          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg transform active:scale-95 ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-doc-slate text-white hover:bg-slate-800'
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          <button
            onClick={handleCopy}
            disabled={!transcript}
            className="p-4 text-slate-400 hover:text-cyan-600 transition-colors disabled:opacity-30"
            title="Copy transcript"
          >
            {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};
