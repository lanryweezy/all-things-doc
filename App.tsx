import React, { useState } from 'react';
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
import { SeoHelmet } from './components/SeoHelmet';
import { ToolID } from './types';
import { TOOLS } from './constants';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolID | null>(null);

  const renderToolWorkspace = () => {
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
        goHome={() => setActiveTool(null)} 
        activeTool={activeTool}
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {renderToolWorkspace()}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} All Things Doc. Powered by Gemini.</p>
        <div className="mt-2 text-xs text-slate-600 flex justify-center space-x-4">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Sitemap</span>
        </div>
      </footer>
    </div>
  );
};

export default App;