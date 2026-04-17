import React, { useState, useEffect } from 'react';
import { TOOLS } from '../constants';
import { ToolID, ToolCategory } from '../types';
import { ChevronRight, Search, Star } from 'lucide-react';

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
  
  // Tools to highlight as new
  const newTools = [
    ToolID.JWT_SECRET_GENERATOR,
    ToolID.UUID_GENERATOR,
    ToolID.UNIT_CONVERTER,
    ToolID.TEXT_CASE_CONVERTER,
    ToolID.HASH_GENERATOR,
    ToolID.QR_GENERATOR,
    ToolID.PASSWORD_GENERATOR,
    ToolID.LOREM_IPSUM_GENERATOR,
    ToolID.MARKDOWN_TOOL,
    ToolID.DIFF_CHECKER,
    ToolID.EXIF_REMOVER,
    ToolID.JSON_TO_TYPESCRIPT,
    ToolID.SQL_FORMATTER,
    ToolID.SVG_CONVERTER,
    ToolID.REGEX_TESTER,
    ToolID.COLOR_PALETTE,
    ToolID.HTML_TO_MARKDOWN,
    ToolID.IMAGE_CROPPER,
    ToolID.SPEECH_TO_TEXT,
    ToolID.TEXT_CLEANER,
    ToolID.IMAGE_TO_BASE64,
    ToolID.CSV_EDITOR,
    ToolID.DATE_CALCULATOR,
    ToolID.PERCENTAGE_CALCULATOR,
    ToolID.LOAN_CALCULATOR,
    ToolID.BMI_CALCULATOR,
    ToolID.COLOR_CONVERTER,
    ToolID.QR_SCANNER,
    ToolID.STOPWATCH,
    ToolID.RANDOM_GENERATOR,
    ToolID.STRING_ESCAPER,
    ToolID.BASE64_TO_IMAGE,
    ToolID.NUMBER_TO_WORDS,
    ToolID.MORSE_CODE_CONVERTER,
    ToolID.ASPECT_RATIO_CALCULATOR,
    ToolID.UNIX_TIMESTAMP_CONVERTER,
    ToolID.PASSWORD_STRENGTH_CHECKER,
    ToolID.COLOR_CONTRAST_CHECKER,
    ToolID.SCREEN_RECORDER,
    ToolID.WEB_FORMATTER,
    ToolID.PRIVACY_REDACTOR,
    ToolID.EXIF_VIEWER,
    ToolID.SIGNATURE_GENERATOR,
    ToolID.FILE_HASHER,
    ToolID.JWT_DECODER,
  ];

  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'featured'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<ToolID[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('atd-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: ToolID) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('atd-favorites', JSON.stringify(newFavs));
  };

  const allTools = Object.values(TOOLS);
  
  // Tools to display in Featured section
  const featuredTools = allTools.filter(tool =>
    [
      ToolID.MAGIC_SUMMARIZER,
      ToolID.PDF_OCR,
      ToolID.MARKDOWN_TOOL,
      ToolID.SPEECH_TO_TEXT,
      ToolID.IMAGE_CROPPER,
      ToolID.UNIT_CONVERTER,
      ToolID.CSV_EDITOR,
      ToolID.PERCENTAGE_CALCULATOR,
      ToolID.LOAN_CALCULATOR,
      ToolID.DATE_CALCULATOR,
      ToolID.BMI_CALCULATOR,
      ToolID.STOPWATCH,
      ToolID.PRIVACY_REDACTOR,
      ToolID.QR_GENERATOR,
      ToolID.PASSWORD_GENERATOR,
    ].includes(tool.id)
  );

  const activeTools = searchQuery
    ? allTools.filter(
        tool =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.keywords?.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : activeCategory === 'featured'
      ? featuredTools
      : allTools.filter(tool => tool.category === activeCategory);

  const favoriteTools = allTools.filter(tool => favorites.includes(tool.id));

  // Tool tips for complex tools that need additional explanation
  const toolTips: Record<string, string> = {
    [ToolID.MAGIC_SUMMARIZER]:
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
    [ToolID.POWERPOINT_TO_PDF]: 'Convert PowerPoint presentations to PDF format',
    [ToolID.JSON_TO_CSV]: 'Transform JSON data structures into CSV format for analysis',
    [ToolID.CSV_TO_JSON]: 'Convert CSV data into structured JSON format',
    [ToolID.XML_TO_JSON]: 'Parse XML documents and convert to JSON structure',
    [ToolID.IMAGE_CONVERTER]: 'Convert between different image formats (PNG, JPG, WebP, etc.)',
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
        
        <div className="max-w-md mx-auto mt-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 sm:text-sm transition-colors shadow-sm"
            placeholder="Search for tools (e.g., PDF to Word, OCR, JSON...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery && (
      <div className="sticky top-16 z-40 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-4 border-b border-slate-200 dark:border-slate-700 mb-8 transition-colors">
        <div className="flex flex-wrap justify-center gap-2 px-2" role="tablist" aria-label="Tool Categories">
          {favorites.length > 0 && (
            <button
              onClick={() => setActiveCategory('favorites' as any)}
              className={`
                whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center
                ${
                  activeCategory === ('favorites' as any)
                    ? 'bg-yellow-400 text-slate-900 shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }
              `}
            >
              <Star size={16} className={`mr-1 ${activeCategory === ('favorites' as any) ? 'fill-current' : 'text-yellow-400'}`} /> Pins
            </button>
          )}
          <button
            onClick={() => setActiveCategory('featured')}
            role="tab"
            aria-selected={activeCategory === 'featured'}
            aria-controls="panel-featured"
            id="tab-featured"
            className={`
              whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center
              ${
                activeCategory === 'featured'
                  ? 'bg-cyan-600 text-white shadow-md transform scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors'
              }
            `}
          >
            <span className="mr-1">🔥</span> Popular
          </button>
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
                    ? 'bg-cyan-600 text-white shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-doc-slate dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      )}

      <div 
        className="animate-fade-in min-h-[400px]"
        role="tabpanel"
        id={!searchQuery ? (activeCategory === 'featured' ? 'panel-featured' : `panel-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`) : undefined}
        aria-labelledby={!searchQuery ? (activeCategory === 'featured' ? 'tab-featured' : `tab-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`) : undefined}
      >
        <div className="flex items-center space-x-4 mb-6 px-2 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-doc-slate dark:text-white transition-colors">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : activeCategory === 'featured' 
                ? 'Popular & Featured Tools' 
                : activeCategory === ('favorites' as any)
                  ? 'Your Pinned Tools'
                  : activeCategory}
          </h2>
          <div className="h-px bg-slate-200 flex-grow"></div>
          <span className="text-sm text-slate-400 dark:text-slate-500 font-medium transition-colors">
            {activeTools.length} Tools
          </span>
        </div>

        {activeTools.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No tools found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto mb-8">
              We couldn't find any tools matching "{searchQuery}". Try adjusting your search terms or browse by category.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              Clear search & view all tools
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-6 lg:px-8">
          {activeTools.map(tool => {
            const hasToolTip = toolTips[tool.id];
            const isNew = newTools.includes(tool.id);
            const toolCard = (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                onKeyDown={(e) => handleKeyDown(e, tool.id)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${tool.title}: ${tool.description}`}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-lg hover:border-cyan-100 dark:hover:border-red-800 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 relative overflow-hidden"
              >
                <button
                  onClick={(e) => toggleFavorite(e, tool.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
                    favorites.includes(tool.id)
                      ? 'bg-yellow-400 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-300 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Star size={14} className={favorites.includes(tool.id) ? 'fill-current' : ''} />
                </button>
                {isNew && !favorites.includes(tool.id) && (
                  <div className="absolute top-3 left-3 bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    NEW
                  </div>
                )}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className={`w-7 h-7 ${tool.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-doc-slate dark:text-white mb-2 group-hover:text-cyan-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-grow transition-colors">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm font-bold text-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
        )}
      </div>
    </div>
  );
};
