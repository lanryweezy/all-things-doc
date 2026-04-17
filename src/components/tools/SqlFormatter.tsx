import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import React, { useState } from 'react';
import { ArrowLeft, Database, Copy, Check, Beaker } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';
import { format } from 'sql-formatter';

interface SqlFormatterProps {
  onBack: () => void;
}

export const SqlFormatter: React.FC<SqlFormatterProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.SQL_FORMATTER];

  const handleFormat = () => {
    try {
      const formatted = format(input, {
        language: dialect as any,
        uppercase: true,
      });
      setOutput(formatted);
    } catch (err) {
      showToast('Error formatting SQL. Please check your syntax.', 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    const sample = `SELECT
  u.id,
  u.username,
  u.email,
  o.order_date,
  o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
  AND o.total_amount > 100
ORDER BY o.order_date DESC
LIMIT 10;`;
    setInput(sample);
    setOutput('');
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Input SQL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cyan-600 outline-none resize-none font-mono text-sm"
            placeholder="SELECT * FROM users WHERE id = 1"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
            <span>Formatted SQL</span>
            {output && (
              <button onClick={handleCopy} className="text-cyan-600 hover:text-cyan-700 text-xs flex items-center font-semibold">
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </label>
          <textarea
            readOnly
            value={output}
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none font-mono text-sm text-slate-700"
            placeholder="Formatted code will appear here..."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 flex-shrink-0">
        <select
          value={dialect}
          onChange={(e) => setDialect(e.target.value)}
          className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-600 outline-none font-bold text-slate-600"
        >
          <option value="sql">Standard SQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="tsql">T-SQL (SQL Server)</option>
          <option value="mariadb">MariaDB</option>
        </select>
        <Button onClick={handleFormat} disabled={!input.trim()} className="bg-slate-900 min-w-[150px]" icon={<Database size={18} />}>
          Format SQL
        </Button>
        <Button
          onClick={handleLoadSample}
          variant="outline"
          className="min-w-[150px] border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          icon={<Beaker size={18} />}
        >
          Sample
        </Button>
      </div>
    </div>
  );
};
