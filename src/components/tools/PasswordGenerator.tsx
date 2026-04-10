import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface PasswordGeneratorProps {
  onBack: () => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS[ToolID.PASSWORD_GENERATOR];

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('');
      return;
    }

    let generatedPassword = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(array[i] % charset.length);
    }
    setPassword(generatedPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (length < 8) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (length < 12) return { label: 'Medium', color: 'bg-yellow-500', width: '50%' };
    if (length < 16) return { label: 'Strong', color: 'bg-green-500', width: '75%' };
    return { label: 'Very Strong', color: 'bg-emerald-600', width: '100%' };
  };

  const strength = getStrength();

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
        <div className="relative group">
          <div className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-mono text-center break-all text-doc-slate min-h-[80px] flex items-center justify-center">
            {password || <span className="text-slate-300">Select options</span>}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2">
            <button
              onClick={generatePassword}
              className="p-2 text-slate-400 hover:text-doc-red transition-colors"
              title="Regenerate"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="p-2 text-slate-400 hover:text-doc-red transition-colors"
              title="Copy"
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>Strength: {strength.label}</span>
            <span>Length: {length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${strength.color}`}
              style={{ width: strength.width }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-doc-slate">Password Length</h3>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-doc-red"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>4</span>
              <span>16</span>
              <span>32</span>
              <span>50</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-doc-slate">Include Characters</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Uppercase', state: includeUppercase, setter: setIncludeUppercase },
                { label: 'Lowercase', state: includeLowercase, setter: setIncludeLowercase },
                { label: 'Numbers', state: includeNumbers, setter: setIncludeNumbers },
                { label: 'Symbols', state: includeSymbols, setter: setIncludeSymbols },
              ].map((opt) => (
                <label key={opt.label} className="flex items-center space-x-3 cursor-pointer group">
                  <div
                    onClick={() => opt.setter(!opt.state)}
                    className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                      opt.state ? 'bg-doc-red border-doc-red' : 'bg-white border-slate-200 group-hover:border-doc-red/30'
                    }`}
                  >
                    {opt.state && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium text-slate-600">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
