import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfUseProps {
  onBack: () => void;
}

export const TermsOfUse: React.FC<TermsOfUseProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-doc-slate mb-8">Terms of Use</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 mb-4">
                By accessing and using All Things Doc, you agree to be bound by these Terms of Use.
                If you do not agree with any part of these terms, you must not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">
                2. Description of Service
              </h2>
              <p className="text-slate-600 mb-4">
                All Things Doc provides free online document processing tools including PDF
                manipulation, file conversion, and AI-powered text processing features. All
                processing happens directly in your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">
                3. User Responsibilities
              </h2>
              <p className="text-slate-600 mb-4">You are responsible for:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Any content you upload or process using our tools</li>
                <li>Ensuring you have the right to process any documents you upload</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Not using the service for any illegal or unauthorized purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">4. Privacy and Data</h2>
              <p className="text-slate-600 mb-4">
                We are committed to protecting your privacy. All document processing happens locally
                in your browser. We do not store, collect, or transmit your documents to our
                servers. Please refer to our Privacy Policy for more details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-slate-600 mb-4">
                All content, features, and functionality of All Things Doc are owned by us and are
                protected by international copyright, trademark, and other intellectual property
                laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">
                6. Disclaimer of Warranties
              </h2>
              <p className="text-slate-600 mb-4">
                All Things Doc is provided "as is" without any warranties, express or implied. We do
                not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>The results will be accurate or reliable</li>
                <li>The service will meet your specific requirements</li>
                <li>Any errors will be corrected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-slate-600 mb-4">
                In no event shall All Things Doc be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or related to your use of the
                service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">8. Changes to Terms</h2>
              <p className="text-slate-600 mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted on
                this page with an updated effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-doc-slate mb-4">9. Contact Information</h2>
              <p className="text-slate-600">
                If you have any questions about these Terms of Use, please contact us at
                support@allthingsdoc.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
