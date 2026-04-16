import React from 'react';
import { ToolID } from '../../types';
import { TOOLS } from '../../constants';
import { TOOL_SEO_ENHANCEMENTS } from '../../seo-constants';
import { CheckCircle2, Shield, Zap, Globe } from 'lucide-react';

interface AboutToolProps {
  toolId: ToolID;
}

export const AboutTool: React.FC<AboutToolProps> = ({ toolId }) => {
  const tool = TOOLS[toolId];
  const seo = TOOL_SEO_ENHANCEMENTS[toolId as keyof typeof TOOL_SEO_ENHANCEMENTS];

  if (!tool) return null;

  const features = [
    { icon: <Zap size={16} />, text: 'Fast & Instant Processing' },
    { icon: <Shield size={16} />, text: 'Privacy Focused & Secure' },
    { icon: <CheckCircle2 size={16} />, text: 'No Installation Required' },
    { icon: <Globe size={16} />, text: 'Works in Any Browser' },
  ];

  return (
    <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 animate-in fade-in duration-700 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8 px-2 sm:px-0">
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 transition-colors tracking-tight uppercase">
              {seo?.h1 || `About our ${tool.title} tool`}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg transition-colors font-medium">
              {seo?.longDescription || tool.longDescription || tool.description}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 transition-colors">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center space-x-3 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm transition-colors group">
                  <div className="text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">{f.icon}</div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">{f.text}</span>
                </div>
              ))}
            </div>
          </section>

          {seo?.h2 && (
            <section>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-4 transition-colors uppercase tracking-tight">{seo.h2}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                {tool.title} is designed for efficiency and simplicity. Whether you are a professional
                managing thousands of files or a casual user with a quick task, our platform
                provides the reliability and speed you need.
              </p>
            </section>
          )}
        </div>

        <div className="space-y-8 px-2 sm:px-0">
           <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white transition-colors shadow-2xl">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Why <span className="text-cyan-500">AllThingsDoc</span>?</h3>
              <ul className="space-y-5 text-slate-400 text-sm font-medium">
                 <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/10 rounded-lg mr-3 text-cyan-500">
                       <CheckCircle2 size={16} />
                    </div>
                    <span><strong className="text-white">100% Free:</strong> No hidden costs, ads, or subscriptions.</span>
                 </li>
                 <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/10 rounded-lg mr-3 text-cyan-500">
                       <Shield size={16} />
                    </div>
                    <span><strong className="text-white">Privacy First:</strong> Most tools process data locally in your browser.</span>
                 </li>
                 <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/10 rounded-lg mr-3 text-cyan-500">
                       <Zap size={16} />
                    </div>
                    <span><strong className="text-white">AI-Powered:</strong> Advanced intelligence for complex tasks.</span>
                 </li>
                 <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/10 rounded-lg mr-3 text-cyan-500">
                       <Globe size={16} />
                    </div>
                    <span><strong className="text-white">No Account:</strong> Start using tools instantly.</span>
                 </li>
              </ul>
           </div>

           <div className="bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 rounded-[2.5rem] p-8 transition-colors">
              <h3 className="text-cyan-900 dark:text-cyan-100 font-black mb-2 uppercase tracking-tight">Explore More</h3>
              <p className="text-cyan-700 dark:text-cyan-400 text-sm mb-6 font-medium">Over 50+ professional tools are waiting for you.</p>
              <a href="/" className="inline-flex items-center text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-widest text-xs hover:underline transition-colors group">
                 View Gallery
                 <Zap size={14} className="ml-2 fill-current group-hover:scale-125 transition-transform" />
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};
