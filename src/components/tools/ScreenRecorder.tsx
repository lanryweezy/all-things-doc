import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useRef } from 'react';
import { ArrowLeft, Monitor, Circle, StopCircle, Download, Trash2, Camera, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface ScreenRecorderProps {
  onBack: () => void;
}

export const ScreenRecorder: React.FC<ScreenRecorderProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.SCREEN_RECORDER] || {
    title: 'Screen Recorder',
    icon: Monitor,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        showToast('Recording complete');
      };

      recorder.start();
      setIsRecording(true);
      showToast('Recording started');
    } catch (err) {
      console.error(err);
      showToast('Could not start recording', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `recording_${Date.now()}.webm`;
    a.click();
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
        {!videoUrl ? (
          <div className="flex flex-col items-center justify-center text-center space-y-10 py-10">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
               <Video size={64} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {isRecording ? 'Currently Recording...' : 'Quick Screen Capture'}
              </h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Record your entire screen, a window, or a specific browser tab. No software installation needed.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
               {!isRecording ? (
                 <Button
                   onClick={startRecording}
                   className="bg-rose-600 px-12 py-6 text-lg font-black rounded-2xl shadow-xl shadow-rose-100"
                   icon={<Circle size={20} className="fill-current" />}
                 >
                   START RECORDING
                 </Button>
               ) : (
                 <Button
                   onClick={stopRecording}
                   className="bg-slate-900 px-12 py-6 text-lg font-black rounded-2xl"
                   icon={<StopCircle size={20} />}
                 >
                   STOP RECORDING
                 </Button>
               )}
               <p className="text-xs text-slate-400 font-medium italic">
                 Recording is processed locally and never leaves your machine.
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center px-2">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recording Preview</h3>
               <button
                 onClick={() => { setVideoUrl(null); }}
                 className="text-slate-400 hover:text-rose-600 text-sm font-bold flex items-center"
               >
                 <Trash2 size={16} className="mr-1" /> Discard
               </button>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
               <video src={videoUrl} controls className="w-full h-full" />
            </div>

            <div className="flex justify-center space-x-4">
               <Button onClick={handleDownload} className="bg-emerald-600 px-10" icon={<Download size={20} />}>
                 Save Recording (.webm)
               </Button>
               <Button onClick={() => setVideoUrl(null)} variant="outline" className="px-10">
                 Record Another
               </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
