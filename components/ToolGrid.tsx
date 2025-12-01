import React, { useState } from 'react';
import { TOOLS } from '../constants';
import { ToolID, ToolCategory } from '../types';
import { ChevronRight } from 'lucide-react';

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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-extrabold text-doc-slate">
          Every tool you need to work with files
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage your documents efficiently with our suite of client-side and AI-powered tools. 
          100% free and easy to use.
        </p>
      </div>

      <div className="sticky top-16 z-40 bg-slate-50/95 backdrop-blur-sm py-4 border-b border-slate-200 mb-8">
        <div className="flex flex-wrap justify-center gap-2 px-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                ${activeCategory === category 
                  ? 'bg-doc-red text-white shadow-md transform scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-doc-slate border border-slate-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="animate-fade-in min-h-[400px]">
        <div className="flex items-center space-x-4 mb-6 px-2">
            <h2 className="text-2xl font-bold text-doc-slate">{activeCategory}</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
            <span className="text-sm text-slate-400 font-medium">
              {activeTools.length} Tools
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:border-red-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className={`w-7 h-7 ${tool.color}`} />
              </div>
              <h3 className="text-xl font-bold text-doc-slate mb-2 group-hover:text-doc-red transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                {tool.description}
              </p>
              <div className="flex items-center text-sm font-bold text-doc-red opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                Open Tool <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};