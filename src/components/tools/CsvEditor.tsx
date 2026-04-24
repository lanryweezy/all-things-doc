import React, { useState, useRef } from 'react';
import { ArrowLeft, Table, Download, Plus, Trash2, FileUp, Save, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { AboutTool } from '../ui/AboutTool';
import { SeoHelmet } from '../SeoHelmet';
import { Database, FileJson, ArrowRightLeft } from 'lucide-react';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface CsvEditorProps {
  onBack: () => void;
}

export const CsvEditor: React.FC<CsvEditorProps> = ({ onBack }) => {
  const [data, setData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<[number, number] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const toolInfo = TOOLS[ToolID.CSV_EDITOR] || {
    title: 'CSV Editor',
    icon: Table,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const parseCsv = (text: string) => {
    try {
      const lines = text.split(/\r?\n/);
      const rows = lines
        .filter(line => line.trim() !== '')
        .map(line => {
          // Basic CSV parsing (doesn't handle commas in quotes perfectly but good enough for common use)
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (matches) return matches.map(m => m.replace(/^"|"$/g, ''));
          return line.split(',').map(c => c.trim());
        });

      if (rows.length > 0) {
        setHeaders(rows[0]);
        setData(rows.slice(1));
        showToast('CSV loaded successfully');
      }
    } catch (err) {
      showToast('Failed to parse CSV', 'error');
    }
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
    showToast('CSV downloaded');
  };

  const addRow = () => {
    setData([...data, new Array(headers.length).fill('')]);
  };

  const addColumn = () => {
    const newColName = `Column ${headers.length + 1}`;
    setHeaders([...headers, newColName]);
    setData(data.map(row => [...row, '']));
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const filteredData = data.filter(row =>
    row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto">
      <SeoHelmet tool={toolInfo as any} />
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${toolInfo.bgColor}`}>
            <toolInfo.icon className={`w-6 h-6 ${toolInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{toolInfo.title}</h1>
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" icon={<FileUp size={18} />}>
            Upload
          </Button>
          {data.length > 0 && (
            <Button onClick={handleDownload} className="bg-emerald-600" icon={<Download size={18} />}>
              Download
            </Button>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Table size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No CSV data loaded</h2>
          <p className="text-slate-500 mb-8">Click here to upload a CSV file or start with a blank table</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={(e) => { e.stopPropagation(); setHeaders(['Column 1', 'Column 2']); setData([['', '']]); }} variant="outline">
              Create Blank Table
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setHeaders(['Date', 'Description', 'Category', 'Amount']);
                setData([
                  ['2023-10-01', 'Online Store', 'Shopping', '$-120.00'],
                  ['2023-10-02', 'Employer Corp', 'Salary', '$5,000.00'],
                  ['2023-10-05', 'Gas Station', 'Transport', '$-65.20'],
                  ['2023-10-10', 'Monthly Rent', 'Housing', '$-1,800.00'],
                  ['2023-10-15', 'Coffee Shop', 'Food', '$-5.50']
                ]);
              }}
              className="bg-emerald-600"
            >
              Sample Data
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={addRow} variant="outline" size="sm" icon={<Plus size={16} />}>Add Row</Button>
              <Button onClick={addColumn} variant="outline" size="sm" icon={<Plus size={16} />}>Add Column</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i} className="p-4 text-sm font-bold text-slate-600 whitespace-nowrap">
                        <input
                          value={header}
                          onChange={(e) => {
                            const newHeaders = [...headers];
                            newHeaders[i] = e.target.value;
                            setHeaders(newHeaders);
                          }}
                          className="bg-transparent border-none focus:ring-0 w-full font-bold outline-none"
                        />
                      </th>
                    ))}
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50 transition-colors group">
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="p-2">
                          <input
                            value={cell}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="w-full p-2 bg-transparent border-none focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded outline-none transition-all"
                          />
                        </td>
                      ))}
                      <td className="p-2 text-right">
                        <button
                          onClick={() => deleteRow(rowIndex)}
                          className="p-2 text-slate-300 hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-2 font-medium">
            <span>Rows: {data.length} | Columns: {headers.length}</span>
            <span>All edits are local to your browser</span>
          </div>
        </div>
      )}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => window.location.href = '/tools/data-converter/csv-to-json'}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileJson className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Step?</p>
              <p className="text-sm text-slate-700 font-bold">Convert to JSON</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => window.location.href = '/tools/data-converter/csv-to-excel'}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Step?</p>
              <p className="text-sm text-slate-700 font-bold">Convert to Excel</p>
            </div>
          </div>
        </div>
      </div>

      <AboutTool toolId={ToolID.CSV_EDITOR} />
    </div>
  );
};
