import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-doc-slate mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">1. Information We Collect</h2>
              <p className="text-slate-600 mb-4">
                All Things Doc is designed with privacy in mind. We do not collect, store, or transmit any personal information or document content to our servers.
              </p>
              <p className="text-slate-600">
                All document processing happens directly in your browser using client-side technologies. Your files never leave your device.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">2. How We Process Your Data</h2>
              <p className="text-slate-600 mb-4">
                When you use our tools, your documents are processed entirely in your browser. We use:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Client-side JavaScript for document manipulation</li>
                <li>Browser APIs for file reading and processing</li>
                <li>AI features that process data locally when possible</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">3. Third-Party Services</h2>
              <p className="text-slate-600 mb-4">
                Some AI-powered features may use third-party APIs (such as Google Gemini) for processing. When this occurs:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Data is processed securely over encrypted connections</li>
                <li>We do not store your data on our servers</li>
                <li>Third-party services are subject to their own privacy policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">4. Cookies and Local Storage</h2>
              <p className="text-slate-600 mb-4">
                We may use browser local storage to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Remember your preferences</li>
                <li>Store temporary processing data</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-slate-600 mt-4">
                This data stays on your device and is not transmitted to our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">5. Security</h2>
              <p className="text-slate-600">
                We implement security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>All processing happens locally in your browser</li>
                <li>No data is stored on our servers</li>
                <li>Secure connections for any API communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">6. Changes to This Policy</h2>
              <p className="text-slate-600">
                We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">7. Contact Us</h2>
              <p className="text-slate-600">
                If you have any questions about this Privacy Policy, please contact us at support@allthingsdoc.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};