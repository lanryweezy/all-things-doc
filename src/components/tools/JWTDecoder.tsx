import React, { useState } from 'react';
import { ArrowLeft, Key, Copy, AlertCircle, RefreshCw, Beaker } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { ShieldCheck, Lock } from 'lucide-react';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface JWTDecoderProps {
  onBack: () => void;
}

export const JWTDecoder: React.FC<JWTDecoderProps> = ({ onBack }) => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{
    header: any;
    payload: any;
    signature: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.JWT_DECODER] || {
    title: 'JWT Decoder',
    icon: Key,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  };

  const decodeJWT = (input: string) => {
    setToken(input);
    if (!input.trim()) {
      setDecoded(null);
      setError(null);
      return;
    }

    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts separated by dots');
      }

      const [headerB64, payloadB64, signature] = parts;

      const decode = (str: string) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      };

      setDecoded({
        header: decode(headerB64),
        payload: decode(payloadB64),
        signature,
      });
      setError(null);
    } catch (err: any) {
      setDecoded(null);
      setError(err.message || 'Invalid JWT format');
    }
  };

  const handleCopy = (obj: any) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    showToast('Copied to clipboard');
  };

  const reset = () => {
    setToken('');
    setDecoded(null);
    setError(null);
  };

  const loadSample = () => {
    const sample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoyNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    decodeJWT(sample);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Encoded Token</label>
          <div className="relative h-[calc(100vh-350px)] min-h-[400px]">
             <textarea
               value={token}
               onChange={(e) => decodeJWT(e.target.value)}
               placeholder="Paste your JWT here..."
               className="w-full h-full p-6 bg-white border border-slate-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm resize-none"
             />
             <div className="absolute right-4 top-4 flex space-x-2">
               {!token && (
                  <button
                    onClick={loadSample}
                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors flex items-center text-xs font-bold"
                  >
                    <Beaker size={16} className="mr-1" /> Sample
                  </button>
               )}
               {token && (
                 <button
                   onClick={reset}
                   className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                 >
                   <RefreshCw size={16} />
                 </button>
               )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {error ? (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-start space-x-4 animate-fade-in">
              <AlertCircle className="text-rose-500 flex-shrink-0" />
              <div>
                <div className="font-bold text-rose-800 mb-1">Invalid Token</div>
                <div className="text-sm text-rose-600">{error}</div>
              </div>
            </div>
          ) : decoded ? (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Header</label>
                   <button onClick={() => handleCopy(decoded.header)} className="text-indigo-600 hover:text-indigo-700 font-bold text-xs">Copy JSON</button>
                </div>
                <pre className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs overflow-auto text-slate-900">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Payload</label>
                   <button onClick={() => handleCopy(decoded.payload)} className="text-indigo-600 hover:text-indigo-700 font-bold text-xs">Copy JSON</button>
                </div>
                <pre className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs overflow-auto text-slate-900">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>

              {/* Signature Info */}
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
                 <div className="font-bold text-indigo-900 mb-2 flex items-center">
                    <Key size={16} className="mr-2" /> Signature
                 </div>
                 <div className="text-xs text-indigo-700 font-medium">
                    The signature is cryptographically secure but cannot be "decoded" into human-readable data.
                    It is used to verify that the token hasn't been tampered with.
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 border-2 border-dashed border-slate-100 rounded-3xl p-12">
               <div className="p-6 bg-slate-50 rounded-full">
                  <Key size={48} />
               </div>
               <p className="text-center font-medium">Decoded content will appear here once you paste a valid JWT.</p>
            </div>
          )}
        </div>
      </div>
      {decoded && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => window.location.href = '/tools/password-strength'}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Check</p>
                <p className="text-sm text-slate-700 font-bold">Check Secret Strength</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => window.location.href = '/tools/jwt-secret-generator'}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Step?</p>
                <p className="text-sm text-slate-700 font-bold">Generate New Secret</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AboutTool toolId={ToolID.JWT_DECODER} />
    </div>
  );
};
