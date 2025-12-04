import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw, Key as KeyIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface JwtSecretGeneratorProps {
  onBack: () => void;
}

export const JwtSecretGenerator: React.FC<JwtSecretGeneratorProps> = ({ onBack }) => {
  const [secret, setSecret] = useState('');
  const [copied, setCopied] = useState(false);
  const [length, setLength] = useState(32);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);

  const toolInfo = TOOLS[ToolID.JWT_SECRET_GENERATOR];

  const generateSecret = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      alert('Please select at least one character type');
      return;
    }

    let generatedSecret = '';
    for (let i = 0; i < length; i++) {
      generatedSecret += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setSecret(generatedSecret);
  };

  const copyToClipboard = async () => {
    if (!secret) return;
    
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearSecret = () => {
    setSecret('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Tools</span>
          </button>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${toolInfo.bgColor} mb-4`}>
            <KeyIcon className={`w-8 h-8 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {toolInfo.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {toolInfo.description}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Configuration Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Configuration</h2>
            
            {/* Length Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Secret Length: {length} characters
              </label>
              <input
                type="range"
                min="16"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>16</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Type Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Lowercase</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Uppercase</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Numbers</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Symbols</span>
              </label>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateSecret}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
              icon={RefreshCw}
            >
              Generate Secret
            </Button>
          </div>

          {/* Generated Secret Display */}
          {secret && (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">Generated Secret</h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearSecret}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 font-mono text-sm break-all">
                {secret}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                This secret is {secret.length} characters long and contains a mix of character types for maximum security.
              </p>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Usage Instructions</h3>
            <div className="text-blue-800 space-y-2">
              <p>• Use this secret as your JWT signing key in your application</p>
              <p>• Store the secret securely in environment variables</p>
              <p>• Never commit secrets to version control</p>
              <p>• Use different secrets for different environments (dev, staging, production)</p>
              <p>• Consider rotating secrets periodically for enhanced security</p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Security Note</h3>
            <p className="text-yellow-800">
              This tool generates cryptographically secure random secrets using your browser's built-in random number generator. 
              The secret is generated locally in your browser and never sent to any server. Make sure to store your secret 
              securely and never share it publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};