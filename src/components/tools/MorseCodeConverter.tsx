import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Radio, Copy, Check, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface MorseCodeConverterProps {
  onBack: () => void;
}

const MORSE_CODE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

const REVERSE_MORSE_MAP = Object.fromEntries(Object.entries(MORSE_CODE_MAP).map(([k, v]) => [v, k]));

export const MorseCodeConverter: React.FC<MorseCodeConverterProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.MORSE_CODE_CONVERTER] || {
    title: 'Morse Code',
    icon: Radio,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  };

  const encode = (input: string) => {
    return input.toUpperCase().split('').map(char => MORSE_CODE_MAP[char] || char).join(' ');
  };

  const decode = (input: string) => {
    return input.split(' ').map(code => REVERSE_MORSE_MAP[code] || code).join('');
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setMorse(encode(val));
  };

  const handleMorseChange = (val: string) => {
    setMorse(val);
    setText(decode(val));
  };

  const playMorse = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dot = 0.1;
    const t = ctx.currentTime;

    let offset = 0;
    morse.split('').forEach(char => {
      if (char === '.' || char === '-') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 600;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const duration = char === '.' ? dot : dot * 3;
        gain.gain.setValueAtTime(0, t + offset);
        gain.gain.linearRampToValueAtTime(0.1, t + offset + 0.01);
        gain.gain.setValueAtTime(0.1, t + offset + duration);
        gain.gain.linearRampToValueAtTime(0, t + offset + duration + 0.01);

        osc.start(t + offset);
        osc.stop(t + offset + duration + 0.02);
        offset += duration + dot;
      } else if (char === ' ') {
        offset += dot * 2;
      } else if (char === '/') {
        offset += dot * 4;
      }
    });
    showToast('Playing Morse code...');
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Text</label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold"
            placeholder="Hello world..."
          />
        </div>

        <div className="flex justify-center">
           <Button onClick={playMorse} variant="outline" className="rounded-full px-6" icon={<Volume2 size={18} />}>
             Audio Preview
           </Button>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Morse Code</label>
          <textarea
            value={morse}
            onChange={(e) => handleMorseChange(e.target.value)}
            className="w-full h-32 p-4 bg-slate-900 text-amber-400 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-mono text-xl"
            placeholder=".... . .-.. .-.. ---"
          />
        </div>
      </div>
    </div>
  );
};
