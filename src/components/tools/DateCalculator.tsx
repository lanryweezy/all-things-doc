import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Plus, Minus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface DateCalculatorProps {
  onBack: () => void;
}

export const DateCalculator: React.FC<DateCalculatorProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'difference' | 'add_subtract' | 'timezone'>('difference');

  // Difference Mode
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
  const [diffResult, setDiffResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
  } | null>(null);

  // Add/Subtract Mode
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [addResult, setAddResult] = useState<string | null>(null);

  // Timezone Mode
  const [time, setTime] = useState('12:00');
  const [sourceTz, setSourceTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetTz, setTargetTz] = useState('UTC');
  const [tzResult, setTzResult] = useState<string | null>(null);

  const { showToast } = useToast();
  const toolInfo = TOOLS[ToolID.DATE_CALCULATOR];

  useEffect(() => {
    if (mode === 'difference') {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDiffResult({
        days: diffDays,
        weeks: parseFloat((diffDays / 7).toFixed(1)),
        months: parseFloat((diffDays / 30.44).toFixed(1)),
        years: parseFloat((diffDays / 365.25).toFixed(1)),
      });
    } else if (mode === 'add_subtract') {
      const d = new Date(baseDate);
      d.setFullYear(d.getFullYear() + years);
      d.setMonth(d.getMonth() + months);
      d.setDate(d.getDate() + days);
      setAddResult(d.toDateString());
    } else if (mode === 'timezone') {
      try {
        const [hours, minutes] = time.split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);

        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: targetTz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        // We need a more robust way to shift timezones for "what time is it there when it's X here"
        // This is a simplified version
        const sourceTime = new Date().toLocaleString('en-US', { timeZone: sourceTz });
        const targetTime = new Date().toLocaleString('en-US', { timeZone: targetTz });
        const diff = new Date(targetTime).getTime() - new Date(sourceTime).getTime();

        const finalDate = new Date(d.getTime() + diff);
        setTzResult(formatter.format(finalDate));
      } catch (e) {
        setTzResult('Invalid calculation');
      }
    }
  }, [mode, date1, date2, baseDate, years, months, days, time, sourceTz, targetTz]);

  const commonTimezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];

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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {[
            { id: 'difference', label: 'Days Between', icon: <Calendar size={16} /> },
            { id: 'add_subtract', label: 'Add/Subtract', icon: <Plus size={16} /> },
            { id: 'timezone', label: 'Timezones', icon: <Clock size={16} /> },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-bold transition-all ${
                mode === m.id
                  ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {mode === 'difference' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={date1}
                    onChange={e => setDate1(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={date2}
                    onChange={e => setDate2(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-900"
                  />
                </div>
              </div>

              {diffResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Days', value: diffResult.days },
                    { label: 'Weeks', value: diffResult.weeks },
                    { label: 'Months', value: diffResult.months },
                    { label: 'Years', value: diffResult.years },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-center"
                    >
                      <div className="text-2xl font-black text-indigo-600">{stat.value}</div>
                      <div className="text-xs font-bold text-indigo-400 uppercase mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : mode === 'add_subtract' ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Base Date
                </label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={e => setBaseDate(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Years', value: years, setter: setYears },
                  { label: 'Months', value: months, setter: setMonths },
                  { label: 'Days', value: days, setter: setDays },
                ].map(field => (
                  <div key={field.label} className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                      {field.label}
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => field.setter(v => v - 1)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={field.value}
                        onChange={e => field.setter(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-900 outline-none"
                      />
                      <button
                        onClick={() => field.setter(v => v + 1)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {addResult && (
                <div className="bg-indigo-600 p-8 rounded-2xl text-center text-white shadow-lg shadow-indigo-200 animate-fade-in">
                  <div className="text-sm font-bold text-indigo-200 uppercase tracking-[0.2em] mb-2">
                    Calculated Date
                  </div>
                  <div className="text-3xl font-black">{addResult}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Time (Local)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    From Timezone
                  </label>
                  <select
                    value={sourceTz}
                    onChange={e => setSourceTz(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-900"
                  >
                    <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                      Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                    </option>
                    {commonTimezones.map(tz => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    To Timezone
                  </label>
                  <select
                    value={targetTz}
                    onChange={e => setTargetTz(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-900"
                  >
                    {commonTimezones.map(tz => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {tzResult && (
                <div className="bg-indigo-600 p-8 rounded-2xl text-center text-white shadow-lg shadow-indigo-200 animate-fade-in">
                  <div className="text-sm font-bold text-indigo-200 uppercase tracking-[0.2em] mb-2">
                    Time in {targetTz}
                  </div>
                  <div className="text-5xl font-black">{tzResult}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
