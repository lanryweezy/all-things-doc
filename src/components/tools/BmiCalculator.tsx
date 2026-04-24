import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Info, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface BmiCalculatorProps {
  onBack: () => void;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ onBack }) => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const toolInfo = TOOLS[ToolID.BMI_CALCULATOR] || {
    title: 'BMI Calculator',
    icon: Activity,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  };

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (w > 0 && h > 0) {
      let val: number;
      if (unit === 'metric') {
        val = w / ((h / 100) * (h / 100));
      } else {
        val = (w / (h * h)) * 703;
      }
      setBmi(parseFloat(val.toFixed(1)));

      if (val < 18.5) {
        setCategory('Underweight');
        setColor('text-blue-500');
      } else if (val < 25) {
        setCategory('Normal weight');
        setColor('text-emerald-500');
      } else if (val < 30) {
        setCategory('Overweight');
        setColor('text-amber-500');
      } else {
        setCategory('Obesity');
        setColor('text-rose-500');
      }
    } else {
      setBmi(null);
    }
  }, [weight, height, unit]);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setUnit('metric')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${unit === 'metric' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
            >
              Metric (kg/cm)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${unit === 'imperial' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
            >
              Imperial (lb/in)
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-2xl font-bold text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Height ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-2xl font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {bmi ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Your BMI</div>
              <div className={`text-7xl font-black mb-4 ${color}`}>{bmi}</div>
              <div className={`text-2xl font-bold px-6 py-2 rounded-full bg-slate-50 ${color}`}>
                {category}
              </div>

              <div className="mt-8 w-full space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
                  <div className="h-full bg-emerald-400" style={{ width: '6.5%' }} />
                  <div className="h-full bg-amber-400" style={{ width: '5%' }} />
                  <div className="h-full bg-rose-400" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center text-slate-400">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p>Enter your weight and height to calculate your Body Mass Index.</p>
            </div>
          )}

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
            <Info className="text-blue-500 mt-1 flex-shrink-0" size={18} />
            <div className="text-sm text-blue-800 leading-relaxed">
              <p className="font-bold mb-1">About BMI</p>
              Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults.
            </div>
          </div>
        </div>
      </div>
      <AboutTool toolId={ToolID.BMI_CALCULATOR} />
    </div>
  );
};
