import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
                <Shield size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-bold uppercase tracking-widest text-[10px]">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">1. Information We Collect</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  All Things Doc is designed with privacy in mind. We do not collect, store, or
                  transmit any personal information or document content to our servers. All document processing happens directly in your browser using client-side technologies. Your files never leave your device.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">2. How We Process Your Data</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  When you use our tools, your documents are processed entirely in your browser. We use:
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium list-disc pl-5">
                  <li>Client-side JavaScript for document manipulation</li>
                  <li>Browser APIs for file reading and processing</li>
                  <li>AI features that process data locally when possible</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">3. Third-Party Services</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Some AI-powered features may use third-party APIs (such as Google Gemini) for processing. When this occurs:
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium list-disc pl-5">
                  <li>Data is processed securely over encrypted connections</li>
                  <li>We do not store your data on our servers</li>
                  <li>Third-party services are subject to their own privacy policies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-tight">4. Contact Us</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at <strong>support@allthingsdoc.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
