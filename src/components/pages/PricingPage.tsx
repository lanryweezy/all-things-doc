import React from 'react';
import { ArrowLeft, CheckCircle2, Shield, Info, Check, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = React.useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Tools
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-doc-slate dark:text-white mb-4 transition-colors">
            Pricing plans
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Choose the plan that suits you
          </p>

          <div className="mt-8 flex justify-center items-center gap-4">
            <span
              className={`text-sm font-medium ${billing === 'monthly' ? 'text-doc-slate dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setBilling(b => (b === 'monthly' ? 'yearly' : 'monthly'))}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-cyan-600 transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billing === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${billing === 'yearly' ? 'text-doc-slate dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Yearly Billing
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                -42%
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col transition-colors">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-doc-slate dark:text-white mb-2">Basic</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">1 user</p>
              <div className="text-4xl font-bold text-doc-slate dark:text-white mb-2">Free</div>
            </div>

            <button className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-doc-slate dark:text-white rounded-xl font-semibold transition-colors mb-8">
              Start for free
            </button>

            <div className="flex-grow">
              <p className="text-sm font-semibold text-doc-slate dark:text-white mb-4">
                Free features include:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
                  Access to essential AllThingsDoc tools
                </li>
                <li className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
                  Limited document processing
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-cyan-600 rounded-2xl shadow-lg border border-cyan-500 p-8 flex flex-col transform md:-translate-y-4 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
              <p className="text-cyan-100 text-sm mb-6">1 - 25 users</p>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold text-white">
                  ${billing === 'monthly' ? '7' : '4'}
                </span>
                <span className="text-cyan-100 ml-2">/mo</span>
              </div>
              <p className="text-cyan-100 text-sm">
                Billed {billing === 'monthly' ? 'monthly' : 'annually ($48/yr)'}
              </p>
            </div>

            <button className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-cyan-600 rounded-xl font-bold transition-colors mb-8 shadow-sm">
              Go Premium
            </button>

            <div className="flex-grow text-white">
              <p className="text-sm font-semibold mb-4 text-cyan-50">Premium features include:</p>
              <ul className="space-y-4">
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Full access to all AllThingsDoc tools
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Unlimited document processing
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Access across Web, Mobile, and Desktop
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Digital Signatures
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Workflows
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Ad-free experience
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Priority customer support
                </li>
                <li className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-cyan-200 mr-3 shrink-0" />
                  Regional file processing
                </li>
                <li className="flex items-start text-sm font-medium">
                  <Check className="w-5 h-5 text-yellow-300 mr-3 shrink-0" />
                  2,000 AI Credits
                </li>
              </ul>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col transition-colors">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-doc-slate dark:text-white mb-2">Business</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">25+ users</p>
              <div className="text-4xl font-bold text-doc-slate dark:text-white mb-2">
                Let's talk
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                Scalable solutions for your business with customized pricing.
              </p>
            </div>

            <button className="w-full py-3 px-4 bg-doc-slate hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors mb-8">
              Contact sales
            </button>

            <div className="flex-grow">
              <p className="text-sm font-semibold text-doc-slate dark:text-white mb-4">
                What's included:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
                  All Premium features
                </li>
                <li className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
                  Custom contracts designed for scalability
                </li>
                <li className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
                  Dedicated Account Manager
                </li>
                <li className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
                  Single Sign On (SSO)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors">
          <h2 className="text-2xl font-bold text-doc-slate dark:text-white mb-8 text-center">
            Compare the plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                    Features
                  </th>
                  <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-doc-slate dark:text-white font-bold mb-1">Basic</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Best for simple use
                    </div>
                  </th>
                  <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-doc-slate dark:text-white font-bold mb-1">Premium</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Best for advanced use
                    </div>
                  </th>
                  <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-doc-slate dark:text-white font-bold mb-1">Business</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Best for growing teams
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Tools
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Limited tools
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    All tools included
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    All tools included
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Batch processing
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Limited
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Unlimited
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Filesize per task
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Limited
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Unlimited
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Teams
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50 text-slate-400">
                    No
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Volume discount
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50 text-slate-400">
                    No
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Workflows
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50 text-slate-400">
                    No
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Ad-free service
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50 text-slate-400">
                    No
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Customer support
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Basic
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Preferential
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Dedicated support
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    AI Credits
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50 text-slate-400">
                    No
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    2,000
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 dark:border-slate-700/50">
                    Custom
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-doc-slate dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Our support team answers these questions almost daily
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-doc-slate dark:text-white mb-4">
                General Questions
              </h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-doc-slate dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-500" />
                    What do I get with the Free Plan?
                  </h4>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-doc-slate dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-500" />
                    Why should I upgrade to Premium?
                  </h4>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-doc-slate dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-500" />
                    Can I switch plans if my needs change?
                  </h4>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-doc-slate dark:text-white mb-4">
                Billing & Payments
              </h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-doc-slate dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-500" />
                    Can I share single billing for multiple accounts?
                  </h4>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-doc-slate dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-500" />
                    What payment methods do you accept?
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Banner */}
        <div className="bg-cyan-50 dark:bg-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between border border-cyan-100 dark:border-slate-700 mb-16 transition-colors">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-lg mr-4 shadow-sm">
              <Info className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="font-semibold text-doc-slate dark:text-white">
                AllThingsDoc is committed to supporting education.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Are you a student or academic professional? Get a full year of Premium for free.
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-6 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-semibold text-doc-slate dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
