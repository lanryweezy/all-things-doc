import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface PasswordStrengthCheckerProps {
  onBack: () => void;
}

export const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Very Weak',
    color: 'bg-slate-200',
    textColor: 'text-slate-400',
  });

  const { showToast } = useToast();
  const toolInfo = TOOLS[ToolID.PASSWORD_STRENGTH_CHECKER] || {
    title: 'Password Strength',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  };

  const requirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'At least one uppercase letter', regex: /[A-Z]/ },
    { label: 'At least one lowercase letter', regex: /[a-z]/ },
    { label: 'At least one number', regex: /[0-9]/ },
    { label: 'At least one special character', regex: /[^A-Za-z0-9]/ },
  ];

  useEffect(() => {
    let score = 0;
    if (password.length > 0) {
      requirements.forEach(req => {
        if (req.regex.test(password)) score++;
      });
      if (password.length >= 12) score++;
      if (password.length >= 16) score++;
    }

    const mapping = [
      { label: 'Very Weak', color: 'bg-rose-500', textColor: 'text-rose-600' },
      { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-600' },
      { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' },
      { label: 'Good', color: 'bg-lime-500', textColor: 'text-lime-600' },
      { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
      { label: 'Very Strong', color: 'bg-emerald-600', textColor: 'text-emerald-700' },
      { label: 'Unbreakable', color: 'bg-cyan-500', textColor: 'text-cyan-600' },
    ];

    setStrength({
      score,
      ...mapping[Math.min(score, mapping.length - 1)],
    });
  }, [password]);

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
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
              Password to Check
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-xl"
                placeholder="Type password..."
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              Requirements
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {requirements.map((req, i) => {
                const isMet = req.regex.test(password);
                return (
                  <div
                    key={i}
                    className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${isMet ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    {isMet ? <Check size={16} className="text-emerald-500" /> : <X size={16} />}
                    <span className="text-sm font-medium">{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
              Strength Meter
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * (password ? strength.score + 1 : 0)) / 8}
                  className={`${strength.textColor} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-black ${strength.textColor}`}>
                  {password ? Math.round(((strength.score + 1) / 8) * 100) : 0}%
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Secure
                </div>
              </div>
            </div>

            <div className={`text-2xl font-black uppercase tracking-tighter ${strength.textColor}`}>
              {password ? strength.label : 'Waiting...'}
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start space-x-4">
            <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
            <div className="text-xs text-amber-800 leading-relaxed font-medium">
              Passwords are never stored or transmitted. All checking logic runs entirely in your
              browser locally for maximum privacy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
