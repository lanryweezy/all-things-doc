import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ImageConverter } from './components/tools/ImageConverter';
import { SmartOCR } from './components/tools/SmartOCR';
import { TextAiTool } from './components/tools/TextAiTool';
import { PdfAiTool } from './components/tools/PdfAiTool';
import { PdfGeneralTool } from './components/tools/PdfGeneralTool';
import { DocChat } from './components/tools/DocChat';
import { TextToSpeech } from './components/tools/TextToSpeech';
import { DataConverter } from './components/tools/DataConverter';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfUse } from './components/legal/TermsOfUse';
import { Sitemap } from './components/legal/Sitemap';
import { SeoHelmet } from './components/SeoHelmet';
import { ToolID } from './types';
import { TOOLS } from './constants';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolID | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy-policy' | 'terms-of-use' | 'sitemap'>('home');

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      switch (path) {
        case '/privacy-policy':
          setCurrentPage('privacy-policy');
          setActiveTool(null);
          break;
        case '/terms-of-use':
          setCurrentPage('terms-of-use');
          setActiveTool(null);
          break;
        case '/sitemap':
          setCurrentPage('sitemap');
          setActiveTool(null);
          break;
        default:
          setCurrentPage('home');
          break;
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    const event = new PopStateEvent('popstate');
    window.dispatchEvent(event);
  };

  const goHome = () => {
    setActiveTool(null);
    navigateTo('/');
  };

  const renderToolWorkspace = () => {
    // Handle legal pages
    switch (currentPage) {
      case 'privacy-policy':
        return <PrivacyPolicy onBack={goHome} />;
      case 'terms-of-use':
        return <TermsOfUse onBack={goHome} />;
      case 'sitemap':
        return <Sitemap onBack={goHome} />;
      default:
        break;
    }

    // Handle tool pages
    switch (activeTool) {
      // Intelligent Document
      case ToolID.CHAT_WITH_DOC:
        return <DocChat onBack={() => setActiveTool(null)} />;
      
      // Audio Tools
      case ToolID.TEXT_TO_SPEECH:
        return <TextToSpeech onBack={() => setActiveTool(null)} />;

      // Data Tools
      case ToolID.JSON_TO_CSV:
      case ToolID.CSV_TO_JSON:
      case ToolID.XML_TO_JSON:
      case ToolID.JSON_TO_XML:
        return activeTool ? (
          <DataConverter toolId={activeTool} onBack={() => setActiveTool(null)} />
        ) : null;

      // Client/Image Tools
      case ToolID.IMAGE_CONVERTER:
        return <ImageConverter onBack={() => setActiveTool(null)} />;
      
      // Image/Scan to Text (AI)
      case ToolID.SMART_OCR:
        return <SmartOCR onBack={() => setActiveTool(null)} />;
      
      // PDF to Data Extraction (AI)
      case ToolID.PDF_TO_WORD:
      case ToolID.PDF_TO_EXCEL:
      case ToolID.PDF_TO_POWERPOINT:
      case ToolID.PDF_OCR:
      case ToolID.PDF_BANK_STATEMENT_CONVERTER:
        return <PdfAiTool toolId={activeTool} onBack={() => setActiveTool(null)} />;
      
      // Text Analysis Tools (AI)
      case ToolID.MAGIC_SUMMARIZER:
      case ToolID.UNIVERSAL_TRANSLATOR:
      case ToolID.CODE_MORPH:
      case ToolID.GRAMMAR_POLISH:
        return activeTool ? (
          <TextAiTool toolId={activeTool} onBack={() => setActiveTool(null)} />
        ) : null;

      // General PDF & File Utilities (Simulated/Binary)
      case ToolID.PDF_MERGE:
      case ToolID.PDF_SPLIT:
      case ToolID.PDF_COMPRESS:
      case ToolID.PDF_PROTECT:
      case ToolID.PDF_UNLOCK:
      case ToolID.PDF_WATERMARK:
      case ToolID.PDF_EDIT:
      case ToolID.PDF_ROTATE:
      case ToolID.PDF_ORGANIZE:
      case ToolID.PDF_SIGN:
      case ToolID.PDF_REPAIR:
      case ToolID.PDF_REDACT:
      case ToolID.PDF_CROP:
      case ToolID.PDF_PAGE_NUMBERS:
      case ToolID.PDF_COMPARE:
      case ToolID.PDF_SCAN:
      // Binary Conversions
      case ToolID.GENERIC_TO_PDF:
      case ToolID.WORD_TO_PDF:
      case ToolID.EXCEL_TO_PDF:
      case ToolID.POWERPOINT_TO_PDF:
      case ToolID.JPG_TO_PDF:
      case ToolID.HTML_TO_PDF:
      case ToolID.PDF_TO_JPG:
      case ToolID.PDF_TO_PNG:
      case ToolID.PDF_TO_PDFA:
      // Office Tools (Binary/Simulated)
      case ToolID.WORD_TO_EXCEL:
      case ToolID.EXCEL_TO_WORD:
      case ToolID.PPT_TO_WORD:
      case ToolID.WORD_TO_PPT:
      case ToolID.EXCEL_TO_CSV:
      case ToolID.CSV_TO_EXCEL:
      case ToolID.TEXT_TO_WORD:
      case ToolID.WORD_TO_TEXT:
      case ToolID.WORD_TO_JPG:
      case ToolID.PPT_TO_JPG:
      case ToolID.EXCEL_TO_JPG:
      case ToolID.COMPRESS_WORD:
      case ToolID.COMPRESS_EXCEL:
      case ToolID.COMPRESS_PPT:
      case ToolID.MERGE_WORD:
        return activeTool ? (
          <PdfGeneralTool toolId={activeTool} onBack={() => setActiveTool(null)} />
        ) : null;

      default:
        return <ToolGrid onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SeoHelmet tool={activeTool ? TOOLS[activeTool] : undefined} />
      <Header 
        goHome={goHome} 
        activeTool={activeTool}
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {renderToolWorkspace()}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} All Things Doc.</p>
        <div className="mt-2 text-xs text-slate-600 flex justify-center space-x-4">
          <a 
            href="/privacy-policy" 
            onClick={(e) => { e.preventDefault(); navigateTo('/privacy-policy'); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms-of-use" 
            onClick={(e) => { e.preventDefault(); navigateTo('/terms-of-use'); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms of Use
          </a>
          <a 
            href="/sitemap" 
            onClick={(e) => { e.preventDefault(); navigateTo('/sitemap'); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Sitemap
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;