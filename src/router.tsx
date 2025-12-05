import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom';
import App from './App';
import { ToolGrid } from './components/ToolGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ToolID } from './types';

// Lazy load tool components
const ImageConverter = lazy(() => import('./components/tools/ImageConverter').then(module => ({ default: module.ImageConverter })));
const SmartOCR = lazy(() => import('./components/tools/SmartOCR').then(module => ({ default: module.SmartOCR })));
const TextAiTool = lazy(() => import('./components/tools/TextAiTool').then(module => ({ default: module.TextAiTool })));
const PdfAiTool = lazy(() => import('./components/tools/PdfAiTool').then(module => ({ default: module.PdfAiTool })));
const PdfGeneralTool = lazy(() => import('./components/tools/PdfGeneralTool').then(module => ({ default: module.PdfGeneralTool })));
const DocChat = lazy(() => import('./components/tools/DocChat').then(module => ({ default: module.DocChat })));
const TextToSpeech = lazy(() => import('./components/tools/TextToSpeech').then(module => ({ default: module.TextToSpeech })));
const DataConverter = lazy(() => import('./components/tools/DataConverter').then(module => ({ default: module.DataConverter })));
const JwtSecretGenerator = lazy(() => import('./components/tools/JwtSecretGenerator').then(module => ({ default: module.JwtSecretGenerator })));

// Lazy load legal pages
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfUse = lazy(() => import('./components/legal/TermsOfUse').then(module => ({ default: module.TermsOfUse })));
const Sitemap = lazy(() => import('./components/legal/Sitemap').then(module => ({ default: module.Sitemap })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner size="lg" message="Loading..." />
  </div>
);

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

  // General PDF Tools (Client-side)
  // All other PDF tools go to generic PDF tool
  return `/tools/pdf/${toolId}`;
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
        path: 'privacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsOfUse />
          </Suspense>
        ),
      },
      {
        path: 'sitemap',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Sitemap />
          </Suspense>
        ),
      },
      {
        path: 'tools/image-converter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ImageConverter onBack={() => window.history.back()} />
          </Suspense>
        ),
      },
      {
        path: 'tools/smart-ocr',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SmartOCR onBack={() => window.history.back()} />
          </Suspense>
        ),
      },
      {
        path: 'tools/text-ai/:toolId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TextAiToolWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/pdf-ai/:toolId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PdfAiToolWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/pdf/:toolId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PdfGeneralToolWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/chat-with-doc',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DocChat onBack={() => window.history.back()} />
          </Suspense>
        ),
      },
      {
        path: 'tools/text-to-speech',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TextToSpeech onBack={() => window.history.back()} />
          </Suspense>
        ),
      },
      {
        path: 'tools/data-converter/:toolId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DataConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/jwt-secret-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JwtSecretGeneratorWrapper />
          </Suspense>
        ),
      },
    ],
  },
]);
