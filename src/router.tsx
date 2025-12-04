import { createBrowserRouter, useParams } from 'react-router-dom';
import App from './App';
import { ToolGrid } from './components/ToolGrid';
import { ImageConverter } from './components/tools/ImageConverter';
import { SmartOCR } from './components/tools/SmartOCR';
import { TextAiTool } from './components/tools/TextAiTool';
import { PdfAiTool } from './components/tools/PdfAiTool';
import { PdfGeneralTool } from './components/tools/PdfGeneralTool';
import { DocChat } from './components/tools/DocChat';
import { TextToSpeech } from './components/tools/TextToSpeech';
import { DataConverter } from './components/tools/DataConverter';
import { JwtSecretGenerator } from './components/tools/JwtSecretGenerator';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfUse } from './components/legal/TermsOfUse';
import { Sitemap } from './components/legal/Sitemap';
import { ToolID } from './types';

// Wrapper components that handle navigation
const ToolGridWrapper = () => (
  <ToolGrid
    onSelectTool={toolId => {
      const toolPath = getToolPath(toolId);
      if (toolPath) {
        window.location.href = toolPath;
      }
    }}
  />
);

const DataConverterWrapper = () => {
  const { toolId } = useParams();
  return <DataConverter toolId={toolId as ToolID} onBack={() => window.history.back()} />;
};

const TextAiToolWrapper = () => {
  const { toolId } = useParams();
  return <TextAiTool toolId={toolId as ToolID} onBack={() => window.history.back()} />;
};

const PdfAiToolWrapper = () => {
  const { toolId } = useParams();
  return <PdfAiTool toolId={toolId as ToolID} onBack={() => window.history.back()} />;
};

const PdfGeneralToolWrapper = () => {
  const { toolId } = useParams();
  return <PdfGeneralTool toolId={toolId as ToolID} onBack={() => window.history.back()} />;
};

const JwtSecretGeneratorWrapper = () => {
  return <JwtSecretGenerator onBack={() => window.history.back()} />;
};

// Helper function to map tool IDs to paths
function getToolPath(toolId: ToolID): string | null {
  // Intelligent Document
  if (toolId === ToolID.CHAT_WITH_DOC) return '/tools/chat-with-doc';

  // Audio Tools
  if (toolId === ToolID.TEXT_TO_SPEECH) return '/tools/text-to-speech';

  // Data Tools
  if (
    [ToolID.JSON_TO_CSV, ToolID.CSV_TO_JSON, ToolID.XML_TO_JSON, ToolID.JSON_TO_XML].includes(
      toolId
    )
  ) {
    return `/tools/data-converter/${toolId}`;
  }

  // Developer Tools
  if (toolId === ToolID.JWT_SECRET_GENERATOR) {
    return '/tools/jwt-secret-generator';
  }

  // Client/Image Tools
  if (toolId === ToolID.IMAGE_CONVERTER) return '/tools/image-converter';

  // Image/Scan to Text (AI)
  if (toolId === ToolID.SMART_OCR) return '/tools/smart-ocr';

  // PDF to Data Extraction (AI)
  if (
    [
      ToolID.PDF_TO_WORD,
      ToolID.PDF_TO_EXCEL,
      ToolID.PDF_TO_POWERPOINT,
      ToolID.PDF_OCR,
      ToolID.PDF_BANK_STATEMENT_CONVERTER,
    ].includes(toolId)
  ) {
    return `/tools/pdf-ai/${toolId}`;
  }

  // Text Analysis Tools (AI)
  if (
    [
      ToolID.MAGIC_SUMMARIZER,
      ToolID.UNIVERSAL_TRANSLATOR,
      ToolID.CODE_MORPH,
      ToolID.GRAMMAR_POLISH,
    ].includes(toolId)
  ) {
    return `/tools/text-ai/${toolId}`;
  }

  // General PDF & File Utilities (Simulated/Binary)
  return `/tools/pdf-general/${toolId}`;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ToolGridWrapper />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy onBack={() => window.history.back()} />,
      },
      {
        path: 'terms-of-use',
        element: <TermsOfUse onBack={() => window.history.back()} />,
      },
      {
        path: 'sitemap',
        element: <Sitemap onBack={() => window.history.back()} />,
      },
      // Tool routes
      {
        path: 'tools/chat-with-doc',
        element: <DocChat onBack={() => window.history.back()} />,
      },
      {
        path: 'tools/text-to-speech',
        element: <TextToSpeech onBack={() => window.history.back()} />,
      },
      {
        path: 'tools/image-converter',
        element: <ImageConverter onBack={() => window.history.back()} />,
      },
      {
        path: 'tools/smart-ocr',
        element: <SmartOCR onBack={() => window.history.back()} />,
      },
      {
        path: 'tools/data-converter/:toolId',
        element: <DataConverterWrapper />,
      },
      {
        path: 'tools/jwt-secret-generator',
        element: <JwtSecretGeneratorWrapper />,
      },
      {
        path: 'tools/text-ai/:toolId',
        element: <TextAiToolWrapper />,
      },
      {
        path: 'tools/pdf-ai/:toolId',
        element: <PdfAiToolWrapper />,
      },
      {
        path: 'tools/pdf-general/:toolId',
        element: <PdfGeneralToolWrapper />,
      },
    ],
  },
]);
