import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface UnitConverterProps {
  onBack: () => void;
}

const UNIT_TYPES = {
  Length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701,
  },
  Weight: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274,
    metric_tons: 0.001,
  },
  Temperature: {
    celsius: 'C',
    fahrenheit: 'F',
    kelvin: 'K',
  },
  Digital: {
    bytes: 1,
    kilobytes: 1 / 1024,
    megabytes: 1 / (1024 * 1024),
    gigabytes: 1 / (1024 * 1024 * 1024),
    terabytes: 1 / (1024 * 1024 * 1024 * 1024),
  },
};

export const UnitConverter: React.FC<UnitConverterProps> = ({ onBack }) => {
  const [type, setType] = useState<keyof typeof UNIT_TYPES>('Length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.UNIT_CONVERTER];

  useEffect(() => {
    const units = Object.keys(UNIT_TYPES[type]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [type]);

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    if (type === 'Temperature') {
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = ((val - 32) * 5) / 9;
      if (fromUnit === 'kelvin') celsius = val - 273.15;

      let finalVal = celsius;
      if (toUnit === 'fahrenheit') finalVal = (celsius * 9) / 5 + 32;
      if (toUnit === 'kelvin') finalVal = celsius + 273.15;

      const resultValue = finalVal;
      if (Math.abs(resultValue) < 0.0001 && resultValue !== 0) {
        setResult(resultValue.toExponential(4));
      } else {
        setResult(resultValue.toFixed(4).replace(/\.?0+$/, ''));
      }
    } else {
      const units = UNIT_TYPES[type] as Record<string, number>;
      const baseValue = val / units[fromUnit];
      const finalValue = baseValue * units[toUnit];

      if (Math.abs(finalValue) < 0.000001 && finalValue !== 0) {
        setResult(finalValue.toExponential(6));
      } else {
        setResult(finalValue.toFixed(6).replace(/\.?0+$/, ''));
      }
    }
  };

  useEffect(handleConvert, [inputValue, fromUnit, toUnit, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="flex justify-center border-b border-slate-100 pb-6">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            {Object.keys(UNIT_TYPES).map(t => (
              <button
                key={t}
                onClick={() => setType(t as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  type === t
                    ? 'bg-white shadow-sm text-doc-red'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <label htmlFor="unit-input" className="block text-sm font-medium text-slate-500">
              From
            </label>
            <div className="space-y-3">
              <input
                id="unit-input"
                type="number"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold text-doc-slate focus:ring-2 focus:ring-doc-red outline-none"
              />
              <label htmlFor="from-unit-select" className="sr-only">
                From Unit
              </label>
              <select
                id="from-unit-select"
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-doc-red"
              >
                {Object.keys(UNIT_TYPES[type]).map(u => (
                  <option key={u} value={u}>
                    {u.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-500">To</label>
            <div className="space-y-3">
              <div
                className="w-full p-4 bg-doc-red/5 border border-doc-red/10 rounded-xl text-2xl font-bold text-doc-red min-h-[64px] flex items-center justify-between"
                role="status"
                aria-live="polite"
              >
                <span>{result || '0'}</span>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="text-doc-red/60 hover:text-doc-red"
                    aria-label="Copy result"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                )}
              </div>
              <label htmlFor="to-unit-select" className="sr-only">
                To Unit
              </label>
              <select
                id="to-unit-select"
                value={toUnit}
                onChange={e => setToUnit(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-doc-red"
              >
                {Object.keys(UNIT_TYPES[type]).map(u => (
                  <option key={u} value={u}>
                    {u.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
