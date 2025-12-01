import React from 'react';
import { TOOLS } from '../constants';
import { ToolID, ToolCategory } from '../types';
import { ChevronRight } from 'lucide-react';

interface ToolGridProps {
  onSelectTool: (id: ToolID) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const categories = [
    ToolCategory.ORGANIZE_PDF,
    ToolCategory.OPTIMIZE_PDF,
    ToolCategory.CONVERT_FROM_PDF,
    ToolCategory.CONVERT_TO_PDF,
    ToolCategory.EDIT_PDF,
    ToolCategory.SECURITY_PDF,
    ToolCategory.AI_INTELLIGENCE,
    ToolCategory.IMAGE_TOOLS,
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-4xl font-extrabold text-doc-slate">
          Every tool you need to work with files
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage your documents efficiently with our suite of client-side and AI-powered tools. 
          100% free and easy to use.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-doc-slate">{category}</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(TOOLS)
              .filter(tool => tool.category === category)
              .map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.bgColor}`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-doc-slate mb-2 group-hover:text-doc-red transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-doc-red opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-200">
                    Open Tool <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};