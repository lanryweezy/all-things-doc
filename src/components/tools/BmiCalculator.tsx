import React, { useState, useEffect } from 'react';
import { Ruler, Weight, Info } from 'lucide-react';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';

interface BmiCalculatorProps {
  onBack: () => void;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ onBack }) => {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const val = w / (h * h);
      setBmi(parseFloat(val.toFixed(1)));

      if (val < 18.5) { setCategory('Underweight'); setColor('text-blue-500'); }
      else if (val < 25) { setCategory('Normal weight'); setColor('text-emerald-500'); }
      else if (val < 30) { setCategory('Overweight'); setColor('text-amber-500'); }
      else { setCategory('Obese'); setColor('text-rose-500'); }
    }
  }, [weight, height]);

  return (
    <ToolLayout toolId={ToolID.BMI_CALCULATOR} onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 transition-colors">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors">Weight (kg)</label>
                <div className="relative">
                   <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                   <input
                     type="number"
                     value={weight}
                     onChange={(e) => setWeight(e.target.value)}
                     className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-colors"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors">Height (cm)</label>
                <div className="relative">
                   <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                   <input
                     type="number"
                     value={height}
                     onChange={(e) => setHeight(e.target.value)}
                     className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-colors"
                   />
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-10 transition-colors">
           {bmi ? (
             <div className="text-center animate-in zoom-in duration-300">
                <div className={`text-7xl font-black mb-2 ${color} transition-colors`}>{bmi}</div>
                <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 transition-colors">Your BMI Score</div>
                <div className={`px-6 py-2 rounded-full border-2 font-black uppercase text-xs tracking-widest ${color} border-current opacity-80`}>
                   {category}
                </div>
             </div>
           ) : (
             <div className="text-slate-300 dark:text-slate-700 italic">Enter your details</div>
           )}
        </div>
      </div>
    </ToolLayout>
  );
};
