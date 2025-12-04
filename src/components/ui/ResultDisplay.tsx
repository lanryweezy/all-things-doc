import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, Link } from 'lucide-react';
import { Button } from './Button';
import { downloadText } from '../../utils/downloadUtils';

interface ResultDisplayProps {
  title: string;
  content: string;
  isCode?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, content, isCode = false }) => {
  const [copied, setCopied] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadTimestamp, setDownloadTimestamp] = useState<number>(0);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      // Use Promise.resolve to avoid synchronous setState in effect
      Promise.resolve().then(() => {
        setDownloadUrl(url);
        setDownloadTimestamp(Date.now());
      });
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      urlRef.current = null;
      Promise.resolve().then(() => setDownloadUrl(null));
    }
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `result-${Date.now()}.txt`;
    downloadText(content, filename);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in mt-8">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">{title}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="!py-1.5 !px-3 !text-xs h-8"
            icon={copied ? <Check size={14} /> : <Copy size={14} />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="!py-1.5 !px-3 !text-xs h-8"
            icon={<Download size={14} />}
          >
            Download
          </Button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`result-${downloadTimestamp}.txt`}
              className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-xs font-medium text-slate-700 transition-colors"
              title="Right-click and select 'Save link as...' if direct download doesn't work"
            >
              <Link size={12} className="mr-1" />
              Alt
            </a>
          )}
        </div>
      </div>
      <div className="p-0">
        <pre
          className={`w-full p-6 overflow-x-auto text-sm leading-relaxed ${isCode ? 'bg-slate-900 text-slate-100 font-mono' : 'bg-white text-slate-700 font-sans whitespace-pre-wrap'}`}
        >
          {content}
        </pre>
      </div>
    </div>
  );
};
