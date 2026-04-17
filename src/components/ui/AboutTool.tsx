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
    <div className="mt-16 border-t border-slate-200 pt-16 pb-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-doc-slate mb-4">
              {seo?.h1 || `About our ${tool.title} tool`}
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {seo?.longDescription || tool.longDescription || tool.description}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-doc-slate mb-4">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <div className="text-cyan-600">{f.icon}</div>
                  <span className="text-sm font-semibold text-slate-700">{f.text}</span>
                </div>
              ))}
            </div>
          </section>

          {seo?.h2 && (
            <section>
              <h3 className="text-xl font-bold text-doc-slate mb-4">{seo.h2}</h3>
              <p className="text-slate-600 leading-relaxed">
                {tool.title} is designed for efficiency and simplicity. Whether you are a professional
                managing thousands of files or a casual user with a quick task, our platform
                provides the reliability and speed you need.
              </p>
            </section>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Why use All Things Doc?</h3>
              <ul className="space-y-4 text-slate-300 text-sm">
                 <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">✓</span>
                    <span><strong>100% Free:</strong> No hidden costs or subscriptions.</span>
                 </li>
                 <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">✓</span>
                    <span><strong>Privacy First:</strong> Most tools process data locally in your browser.</span>
                 </li>
                 <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">✓</span>
                    <span><strong>AI-Powered:</strong> Advanced intelligence for complex documents.</span>
                 </li>
                 <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">✓</span>
                    <span><strong>No Account:</strong> Start using tools instantly without signing up.</span>
                 </li>
              </ul>
           </div>

           <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8">
              <h3 className="text-indigo-900 font-bold mb-2">Looking for more?</h3>
              <p className="text-indigo-700 text-sm mb-4">Explore our full suite of 40+ free productivity and developer tools.</p>
              <a href="/" className="inline-block text-indigo-600 font-bold hover:underline">View all tools →</a>
           </div>
        </div>
      </div>
    </div>
  );
};
