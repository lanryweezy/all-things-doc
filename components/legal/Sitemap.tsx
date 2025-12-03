import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ToolCategory } from '../../types';
import { TOOLS_CONFIG } from '../../constants';

interface SitemapProps {
  onBack: () => void;
}

export const Sitemap: React.FC<SitemapProps> = ({ onBack }) => {
  const categories = Object.values(ToolCategory);
  
  const getToolsByCategory = (category: ToolCategory) => {
    return Object.values(TOOLS_CONFIG).filter(tool => tool.category === category);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center text-doc-red hover:text-red-700 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Tools
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-doc-slate mb-8">Sitemap</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-doc-slate mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-doc-red hover:text-red-700 transition-colors">
                    Home - All Tools
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-doc-red hover:text-red-700 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-of-use" className="text-doc-red hover:text-red-700 transition-colors">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="/sitemap" className="text-doc-red hover:text-red-700 transition-colors">
                    Sitemap
                  </a>
                </li>
              </ul>
            </section>

            {categories.map(category => {
              const tools = getToolsByCategory(category);
              if (tools.length === 0) return null;
              
              return (
                <section key={category}>
                  <h2 className="text-xl font-semibold text-doc-slate mb-4">
                    {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Tools
                  </h2>
                  <ul className="space-y-2">
                    {tools.map(tool => (
                      <li key={tool.id}>
                        <a 
                          href={`/tool/${tool.id}`} 
                          className="text-doc-red hover:text-red-700 transition-colors"
                        >
                          {tool.name}
                        </a>
                        <p className="text-sm text-slate-600 mt-1">{tool.description}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-doc-slate mb-4">About All Things Doc</h2>
            <p className="text-slate-600 leading-relaxed">
              All Things Doc provides free, privacy-focused document tools that run entirely in your browser. 
              No data is stored on our servers - everything is processed locally on your device. 
              Our tools help you convert, merge, split, and process documents without compromising your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};