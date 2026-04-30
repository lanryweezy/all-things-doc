import React, { useState, useEffect } from 'react';
import { ArrowLeft, Landmark, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface LoanCalculatorProps {
  onBack: () => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('250000');
  const [rate, setRate] = useState('5.5');
  const [years, setYears] = useState('30');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('0');
  const [totalPayment, setTotalPayment] = useState<string>('0');
  const [totalInterest, setTotalInterest] = useState<string>('0');

  const { showToast } = useToast();
  const toolInfo = TOOLS[ToolID.LOAN_CALCULATOR] || {
    title: 'Loan Calculator',
    icon: Landmark,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  };

  useEffect(() => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (p > 0 && r > 0 && n > 0) {
      const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = monthly * n;
      const interest = total - p;

      setMonthlyPayment(
        monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );
      setTotalPayment(
        total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );
      setTotalInterest(
        interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );
    } else if (p > 0 && r === 0 && n > 0) {
      const monthly = p / n;
      setMonthlyPayment(monthly.toFixed(2));
      setTotalPayment(p.toFixed(2));
      setTotalInterest('0.00');
    }
  }, [amount, rate, years]);

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
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <DollarSign size={14} className="mr-1" /> Loan Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-2xl font-bold text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <TrendingUp size={14} className="mr-1" /> Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-2xl font-bold text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Calendar size={14} className="mr-1" /> Loan Term (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={e => setYears(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-2xl font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-100 flex flex-col items-center justify-center text-center">
            <div className="text-emerald-100 font-bold uppercase tracking-widest text-sm mb-2">
              Monthly Payment
            </div>
            <div className="text-5xl font-black">${monthlyPayment}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">
                Total Interest
              </div>
              <div className="text-xl font-bold text-slate-900">${totalInterest}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">
                Total Payoff
              </div>
              <div className="text-xl font-bold text-slate-900">${totalPayment}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-500 italic">
            Note: This is a basic calculator for estimation purposes. Real-world loans may include
            taxes, insurance, and variable fees.
          </div>
        </div>
      </div>
      <AboutTool toolId={ToolID.LOAN_CALCULATOR} />
    </div>
  );
};
