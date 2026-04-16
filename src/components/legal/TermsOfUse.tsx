import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfUseProps {
  onBack: () => void;
}

export const TermsOfUse: React.FC<TermsOfUseProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 mb-8 transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Tools
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 transition-colors">
          <div className="flex items-center space-x-3 mb-8">
             <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                <FileText size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Terms of Use</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-bold uppercase tracking-widest text-[10px]">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">1. Acceptance of Terms</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  By accessing and using All Things Doc, you agree to be bound by these Terms of Use.
                  If you do not agree with any part of these terms, you must not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">2. Description of Service</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  All Things Doc provides free online document processing tools including PDF manipulation, file conversion, and AI-powered text processing features. All processing happens directly in your browser.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">3. Limitation of Liability</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  All Things Doc is provided "as is" without warranties. In no event shall we be liable for any damages arising out of your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">4. Contact Information</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  If you have any questions about these Terms, please contact us at <strong>support@allthingsdoc.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
