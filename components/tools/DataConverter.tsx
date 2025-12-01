import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { TOOLS } from '../../constants';
import { ToolID } from '../../types';

interface DataConverterProps {
  toolId: ToolID.JSON_TO_CSV | ToolID.CSV_TO_JSON | ToolID.XML_TO_JSON | ToolID.JSON_TO_XML;
  onBack: () => void;
}

export const DataConverter: React.FC<DataConverterProps> = ({ toolId, onBack }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const toolInfo = TOOLS[toolId];

  useEffect(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, [toolId]);

  const getInputLabel = () => {
    switch (toolId) {
      case ToolID.JSON_TO_CSV: return "JSON";
      case ToolID.CSV_TO_JSON: return "CSV";
      case ToolID.XML_TO_JSON: return "XML";
      case ToolID.JSON_TO_XML: return "JSON";
      default: return "";
    }
  };

  const getOutputLabel = () => {
    switch (toolId) {
      case ToolID.JSON_TO_CSV: return "CSV";
      case ToolID.CSV_TO_JSON: return "JSON";
      case ToolID.XML_TO_JSON: return "JSON";
      case ToolID.JSON_TO_XML: return "XML";
      default: return "";
    }
  };

  const getInputPlaceholder = () => {
    switch (toolId) {
      case ToolID.JSON_TO_CSV: return '[{"name": "John", "age": 30}]';
      case ToolID.CSV_TO_JSON: return 'name,age\nJohn,30';
      case ToolID.XML_TO_JSON: return '<root><person><name>John</name></person></root>';
      case ToolID.JSON_TO_XML: return '{"root": {"person": {"name": "John"}}}';
      default: return "";
    }
  };

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      if (toolId === ToolID.JSON_TO_CSV) {
        const jsonData = JSON.parse(input);
        const arrayData = Array.isArray(jsonData) ? jsonData : [jsonData];
        if (arrayData.length === 0) throw new Error("Empty JSON array");
        
        const headers = Object.keys(arrayData[0]);
        const csvRows = [
          headers.join(','),
          ...arrayData.map(row => 
            headers.map(fieldName => {
              const val = (row as any)[fieldName];
              return JSON.stringify(val ?? ''); // Simple CSV escaping
            }).join(',')
          )
        ];
        setOutput(csvRows.join('\n'));
      } else if (toolId === ToolID.CSV_TO_JSON) {
        const rows = input.trim().split('\n');
        if (rows.length < 2) throw new Error("Invalid CSV: Needs header and at least one row");
        
        const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const jsonResult = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => {
             obj[h] = values[i]; 
          });
          return obj;
        });
        setOutput(JSON.stringify(jsonResult, null, 2));
      } else if (toolId === ToolID.XML_TO_JSON) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "text/xml");
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
           throw new Error("Invalid XML");
        }
        
        const xmlToJson = (node: Node): any => {
          // Text node
          if (node.nodeType === 3) return node.nodeValue?.trim();
          
          // Element node
          if (node.nodeType === 1) {
             const obj: any = {};
             if (node.hasChildNodes()) {
                const childNodes = node.childNodes;
                for (let i = 0; i < childNodes.length; i++) {
                   const child = childNodes[i];
                   if (child.nodeType === 3 && child.nodeValue?.trim() === '') continue; // Skip empty text
                   
                   const childName = child.nodeName;
                   const childValue = xmlToJson(child);
                   
                   if (childValue === "") continue;

                   if (obj[childName]) {
                      if (!Array.isArray(obj[childName])) {
                         obj[childName] = [obj[childName]];
                      }
                      obj[childName].push(childValue);
                   } else {
                      obj[childName] = childValue;
                   }
                }
                // If the object only has a generic #text property (leaf node), return the value directly
                if (Object.keys(obj).length === 1 && obj['#text']) {
                  return obj['#text'];
                }
             }
             return Object.keys(obj).length === 0 ? "" : obj;
          }
        };
        
        const result = xmlToJson(xmlDoc.documentElement);
        setOutput(JSON.stringify(result, null, 2));
      } else if (toolId === ToolID.JSON_TO_XML) {
         const jsonData = JSON.parse(input);
         
         const jsonToXml = (obj: any): string => {
           let xml = '';
           for (const prop in obj) {
             if (Array.isArray(obj[prop])) {
               for (const arrayVal of obj[prop]) {
                 xml += `<${prop}>`;
                 xml += typeof arrayVal === 'object' ? jsonToXml(arrayVal) : arrayVal;
                 xml += `</${prop}>`;
               }
             } else if (typeof obj[prop] === 'object') {
               xml += `<${prop}>`;
               xml += jsonToXml(obj[prop]);
               xml += `</${prop}>`;
             } else {
               xml += `<${prop}>${obj[prop]}</${prop}>`;
             }
           }
           return xml;
         };
         
         // Try to handle root element
         if (Object.keys(jsonData).length === 1) {
           setOutput(jsonToXml(jsonData));
         } else {
           setOutput(`<root>${jsonToXml(jsonData)}</root>`);
         }
      }
    } catch (err) {
      setError(`Conversion Failed: ${(err as Error).message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
       <div className="mb-6 flex-shrink-0">
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

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-doc-slate mb-2">
            Input {getInputLabel()}
          </label>
          <textarea
            className={`flex-grow w-full p-4 bg-white border rounded-xl focus:ring-2 outline-none font-mono text-xs md:text-sm resize-none ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-cyan-500'}`}
            placeholder={getInputPlaceholder()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex flex-col">
           <label className="block text-sm font-medium text-doc-slate mb-2 flex justify-between items-center">
            <span>Output {getOutputLabel()}</span>
            {output && (
              <button 
                onClick={handleCopy} 
                className="text-cyan-600 hover:text-cyan-700 text-xs flex items-center font-semibold"
              >
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied' : 'Copy Output'}
              </button>
            )}
          </label>
          <textarea
            readOnly
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono text-xs md:text-sm resize-none text-slate-600"
            value={output}
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-shrink-0">
        <Button 
          onClick={handleConvert}
          className="bg-cyan-700 hover:bg-cyan-800 min-w-[200px]"
          icon={<ArrowRightLeft size={18} />}
        >
          Convert
        </Button>
      </div>
    </div>
  );
};