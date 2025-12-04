import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Play, Download, Link } from 'lucide-react';
import { Button } from '../ui/Button';
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

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setAudioUrl(null);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        // Convert base64 to blob url
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mp3' }); // Gemini typically returns PCM/WAV/MP3 depending, but standard browser can play it often or we assume MP3/WAV container.
        // The API returns raw audio usually. Let's create a WAV header if needed or assume browser can handle the raw stream in a blob? 
        // Actually the prompt guide says "The audio bytes returned by the API is raw PCM data."
        // We need to decode it.
        
        // Wait, the prompt instruction said: "Transform text input into single-speaker or multi-speaker audio."
        // And provided code for AudioContext decoding. 
        // For simple playback in <audio> tag, we might need a WAV header if it's raw PCM.
        // However, standard `generateContent` with `Modality.AUDIO` usually returns a usable audio file format if configured or raw.
        // The prompt instructions say: "The audio bytes returned by the API is raw PCM data. It is not a standard file format... contains no header information."
        
        // To play raw PCM in a simple <audio> tag is hard. We need to wrap it in a WAV container or use AudioContext.
        // For this demo, let's use the provided AudioContext method to play it, but to "Download" we need a file.
        // Let's implement a simple WAV header generator for the PCM data (1 channel, 24kHz usually for standard voice).
        
        const wavHeader = getWavHeader(byteArray.length, 24000, 1);
        const wavBlob = new Blob([wavHeader, byteArray], { type: 'audio/wav' });
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        setAudioData(new Uint8Array([...new Uint8Array(wavHeader), ...byteArray]));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate speech.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to create a WAV header for raw PCM data
  const getWavHeader = (dataLength: number, sampleRate: number, numChannels: number) => {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    
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

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const handleDownload = () => {
    if (!audioData) return;
    try {
      const filename = 'speech.wav';
      downloadBinary(audioData, filename, 'audio/wav');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or check your browser settings.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-doc-slate mb-2">Enter Text to Speak</label>
          <textarea
            className="w-full h-48 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
            placeholder="Type something here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
           <div className="text-sm text-slate-500">
             Voice: <span className="font-medium text-slate-700">Kore (Balanced)</span>
           </div>
           <Button 
            onClick={handleGenerate} 
            isLoading={isProcessing}
            disabled={!text.trim()}
            className="bg-pink-600 hover:bg-pink-700"
            icon={<Play size={18} />}
           >
             Generate Audio
           </Button>
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