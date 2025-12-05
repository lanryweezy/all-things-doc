import React, { useState } from 'react';
import { TOOLS } from '../constants';
import { ToolID, ToolCategory } from '../types';
import { ChevronRight } from 'lucide-react';

interface ToolTipProps {
  text: string;
  children: React.ReactNode;
}

const ToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-doc-slate rounded-lg shadow-lg whitespace-nowrap">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-doc-slate"></div>
        </div>
      )}
    </div>
  );
};

interface ToolGridProps {
  onSelectTool: (id: ToolID) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const categories = [
    ToolCategory.AI_TOOLS,
    ToolCategory.PDF_TOOLS,
    ToolCategory.OFFICE_TOOLS,
    ToolCategory.DEVELOPER_TOOLS,
    ToolCategory.MEDIA_TOOLS,
  ];

  const [activeCategory, setActiveCategory] = useState<ToolCategory>(categories[0]);

  const activeTools = Object.values(TOOLS).filter(tool => tool.category === activeCategory);

  // Tool tips for complex tools that need additional explanation
  const toolTips: Record<string, string> = {
    [ToolID.PDF_AI_SUMMARIZER]:
      'Uses AI to extract key insights and create concise summaries from PDF documents',
    [ToolID.PDF_BANK_STATEMENT_CONVERTER]:
      'AI-powered extraction of transaction data from bank statements into CSV format',
    [ToolID.PDF_OCR]:
      'Extracts text from scanned PDFs using Optical Character Recognition technology',
    [ToolID.PDF_MERGE]:
      'Combine multiple PDF files into a single document while maintaining quality',
    [ToolID.PDF_SPLIT]: 'Extract specific pages or ranges from PDF documents',
    [ToolID.PDF_COMPRESS]: 'Reduce file size while maintaining document quality and readability',
    [ToolID.EXCEL_TO_PDF]: 'Convert Excel spreadsheets to PDF format with formatting preserved',
    [ToolID.WORD_TO_PDF]: 'Transform Word documents to PDF while maintaining layout and styling',
    [ToolID.PPT_TO_PDF]: 'Convert PowerPoint presentations to PDF format',
    [ToolID.JSON_TO_CSV]: 'Transform JSON data structures into CSV format for analysis',
    [ToolID.CSV_TO_JSON]: 'Convert CSV data into structured JSON format',
    [ToolID.XML_TO_JSON]: 'Parse XML documents and convert to JSON structure',
    [ToolID.IMAGE_COMPRESS]: 'Reduce image file sizes while maintaining visual quality',
    [ToolID.IMAGE_RESIZE]: 'Adjust image dimensions and resolution for different use cases',
    [ToolID.IMAGE_CONVERT]: 'Convert between different image formats (PNG, JPG, WebP, etc.)',
  };

  const handleKeyDown = (e: React.KeyboardEvent, toolId: ToolID) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectTool(toolId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-extrabold text-doc-slate dark:text-white transition-colors">
          Every tool you need to work with files
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          Manage your documents efficiently with our suite of client-side and AI-powered tools. 100%
          free and easy to use.
        </p>
      </div>

      <div className="sticky top-16 z-40 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-4 border-b border-slate-200 dark:border-slate-700 mb-8 transition-colors">
        <div className="flex flex-wrap justify-center gap-2 px-2" role="tablist" aria-label="Tool Categories">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls={`panel-${category.replace(/\s+/g, '-').toLowerCase()}`}
              id={`tab-${category.replace(/\s+/g, '-').toLowerCase()}`}
              className={`
                whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                ${
                  activeCategory === category
                    ? 'bg-doc-red text-white shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-doc-slate dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="animate-fade-in min-h-[400px]"
        role="tabpanel"
        id={`panel-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`}
        aria-labelledby={`tab-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center space-x-4 mb-6 px-2">
          <h2 className="text-2xl font-bold text-doc-slate dark:text-white transition-colors">
            {activeCategory}
          </h2>
          <div className="h-px bg-slate-200 flex-grow"></div>
          <span className="text-sm text-slate-400 dark:text-slate-500 font-medium transition-colors">
            {activeTools.length} Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTools.map(tool => {
            const hasToolTip = toolTips[tool.id];
            const toolCard = (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                onKeyDown={(e) => handleKeyDown(e, tool.id)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${tool.title}: ${tool.description}`}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-lg hover:border-red-100 dark:hover:border-red-800 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-doc-red focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className={`w-7 h-7 ${tool.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-doc-slate dark:text-white mb-2 group-hover:text-doc-red transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-grow transition-colors">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm font-bold text-doc-red opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Open Tool <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                </div>
              </div>
            );

            return hasToolTip ? (
              <ToolTip key={tool.id} text={toolTips[tool.id]}>
                {toolCard}
              </ToolTip>
            ) : (
              toolCard
            );
          })}
        </div>
      </div>
    </div>
  );
};
