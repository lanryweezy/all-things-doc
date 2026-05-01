import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Download, Link, Cpu, Zap, Pause } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { generateSpeech } from '../../services/geminiService';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { downloadBinary } from '../../utils/downloadUtils';

interface TextToSpeechProps {
  onBack: () => void;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [mode, setMode] = useState<'local' | 'ai'>('local');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.TEXT_TO_SPEECH];

  useEffect(() => {
    if (audioData) {
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      setDownloadUrl(null);
    }
  }, [audioData]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleStopLocal = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Helper to create a WAV header for raw PCM data
  const getWavHeader = (dataLength: number, sampleRate: number, numChannels: number) => {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    const writeString = (v: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        v.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
    view.setUint16(32, numChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample

    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    return buffer;
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    if (mode === 'local') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      return;
    }

    setIsProcessing(true);
    setAudioUrl(null);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const wavHeader = getWavHeader(byteArray.length, 24000, 1);
        const wavBlob = new Blob([wavHeader, byteArray], { type: 'audio/wav' });
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        setAudioData(new Uint8Array([...new Uint8Array(wavHeader), ...byteArray]));
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to generate speech.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!audioData) return;
    try {
      const filename = 'speech.wav';
      downloadBinary(audioData, filename, 'audio/wav');
    } catch (error) {
      console.error('Download failed:', error);
      showToast('Download failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-bold text-slate-900">Voice Quality</h3>
            <p className="text-xs text-slate-500">Fast local playback or high-fidelity AI</p>
          </div>
          <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <button
              onClick={() => setMode('local')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'local'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Cpu size={16} />
              <span>Local (Instant)</span>
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'ai'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Zap size={16} />
              <span>AI Studio Voice</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Enter Text to Speak
          </label>
          <textarea
            className="w-full h-48 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
            placeholder="Type something here..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {mode === 'ai' ? (
              <span>
                Voice: <span className="font-medium text-slate-700">Kore (Balanced)</span>
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <label htmlFor="voice-select" className="sr-only">
                  Choose Voice
                </label>
                <select
                  id="voice-select"
                  value={selectedVoice}
                  onChange={e => setSelectedVoice(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-pink-500 max-w-[200px]"
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            {mode === 'local' && isSpeaking && (
              <Button
                onClick={handleStopLocal}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-cyan-50"
                icon={<Pause size={18} />}
              >
                Stop
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              isLoading={isProcessing}
              disabled={!text.trim()}
              className={
                mode === 'ai'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-pink-600 hover:bg-pink-700'
              }
              icon={<Play size={18} />}
            >
              {mode === 'local' ? (isSpeaking ? 'Restart' : 'Play Text') : 'Generate AI Audio'}
            </Button>
          </div>
        </div>

        {audioUrl && (
          <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Generated Audio</h3>
            <audio controls className="w-full mb-4" src={audioUrl} />
            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleDownload}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700"
                icon={<Download size={16} />}
              >
                Download WAV
              </Button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="speech.wav"
                  className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                  title="Right-click and select 'Save link as...' if direct download doesn't work"
                >
                  <Link size={16} className="mr-2" />
                  Alternative Download
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
