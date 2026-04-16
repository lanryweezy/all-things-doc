import React, { useState, useRef } from 'react';
import {
  Table,
  Download,
  Plus,
  Trash2,
  Search,
  FileUp,
  FileJson,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { ToolLayout } from '../ui/ToolLayout';
import { ToolID } from '../../types';

interface CsvEditorProps {
  onBack: () => void;
}

export const CsvEditor: React.FC<CsvEditorProps> = ({ onBack }) => {
  const [data, setData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      setHeaders(rows[0]);
      setData(rows.slice(1).filter(row => row.length > 1 || row[0] !== ''));
      showToast('CSV Loaded Successfully');
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_data.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV Downloaded');
  };

  const addRow = () => setData([...data, new Array(headers.length).fill('')]);
  const addColumn = () => {
    setHeaders([...headers, `Col ${headers.length + 1}`]);
    setData(data.map(row => [...row, '']));
  };

  const filteredData = data.filter(row =>
    row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ToolLayout
      toolId={ToolID.CSV_EDITOR}
      onBack={onBack}
      maxWidth="6xl"
      actions={
        <div className="flex items-center space-x-2">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" icon={<FileUp size={16} />}>
            Upload
          </Button>
          {data.length > 0 && (
            <Button onClick={handleDownload} variant="primary" size="sm" icon={<Download size={16} />}>
              Save
            </Button>
          )}
        </div>
      }
    >
      {data.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 md:p-24 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-all group"
        >
          <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Table size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">No Data Loaded</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium transition-colors">Upload a CSV or start with a sample.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={(e) => { e.stopPropagation(); setHeaders(['ID', 'Name']); setData([['1', 'Sample']]); }} variant="outline">
              Blank Table
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setHeaders(['Date', 'Event', 'Cost']);
                setData([['2023-11-01', 'Server Upgrade', ',200'], ['2023-11-05', 'Domain Renewal', '5']]);
              }}
              className="bg-cyan-600"
            >
              Load Sample
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search rows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Button onClick={addRow} variant="outline" size="sm" className="flex-1 md:flex-none" icon={<Plus size={14} />}>Row</Button>
              <Button onClick={addColumn} variant="outline" size="sm" className="flex-1 md:flex-none" icon={<Plus size={14} />}>Col</Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
                    {headers.map((h, i) => (
                      <th key={i} className="p-4">
                        <input
                          value={h}
                          onChange={(e) => {
                            const n = [...headers]; n[i] = e.target.value; setHeaders(n);
                          }}
                          className="bg-transparent border-none focus:ring-0 w-full font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 outline-none"
                        />
                      </th>
                    ))}
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                  {filteredData.map((row, ri) => (
                    <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-2">
                          <input
                            value={cell}
                            onChange={(e) => {
                              const n = [...data]; n[ri][ci] = e.target.value; setData(n);
                            }}
                            className="w-full p-2 bg-transparent border-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-cyan-500 rounded-lg outline-none transition-all text-slate-700 dark:text-slate-300 text-sm font-medium"
                          />
                        </td>
                      ))}
                      <td className="p-2 text-right">
                        <button onClick={() => setData(data.filter((_, i) => i !== ri))} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 transition-colors">
            <span>Rows: {data.length} | Columns: {headers.length}</span>
            <span>Local Browser Processing Only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 mt-12 transition-colors">
            <button onClick={() => window.location.href = '/tools/data-converter/csv-to-json'} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group">
              <div className="flex items-center space-x-4">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-cyan-600">
                    <FileJson size={18} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors">Export Option</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Convert to JSON</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-cyan-600 transition-colors" />
            </button>
            <button onClick={() => window.location.href = '/tools/data-converter/csv-to-xml'} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group">
              <div className="flex items-center space-x-4">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-amber-600">
                    <ArrowRightLeft size={18} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors">Export Option</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Convert to XML</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-600 transition-colors" />
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
