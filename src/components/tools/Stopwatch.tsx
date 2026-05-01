import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Timer, Flag, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface StopwatchProps {
  onBack: () => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onBack }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  const toolInfo = TOOLS[ToolID.STOPWATCH];

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([time, ...laps]);
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 flex flex-col items-center space-y-12">
        <div className="relative">
          <div className="w-80 h-80 rounded-full border-8 border-slate-50 flex items-center justify-center shadow-inner">
            <div className="text-6xl font-mono font-black text-slate-900 tracking-tighter">
              {formatTime(time)}
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-indigo-100 text-indigo-600 p-3 rounded-2xl animate-bounce">
            <Timer size={32} />
          </div>
        </div>

        <div className="flex space-x-6">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-16 h-16 rounded-full p-0 flex items-center justify-center"
          >
            <RotateCcw size={24} />
          </Button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${isRunning ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
          >
            {isRunning ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
          </button>

          <Button
            onClick={handleLap}
            disabled={time === 0}
            variant="outline"
            className="w-16 h-16 rounded-full p-0 flex items-center justify-center"
          >
            <Flag size={24} />
          </Button>
        </div>

        {laps.length > 0 && (
          <div className="w-full max-w-md space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
              Lap Records
            </h3>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-200 max-h-60 overflow-y-auto custom-scrollbar">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between p-4 font-mono text-sm">
                  <span className="text-slate-400">Lap {laps.length - i}</span>
                  <span className="text-slate-900 font-bold">{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
