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
const UuidGenerator = lazy(() => import('./components/tools/UuidGenerator').then(module => ({ default: module.UuidGenerator })));
const JsonFormatter = lazy(() => import('./components/tools/JsonFormatter').then(module => ({ default: module.JsonFormatter })));
const Base64Tool = lazy(() => import('./components/tools/Base64Tool').then(module => ({ default: module.Base64Tool })));
const HashGenerator = lazy(() => import('./components/tools/HashGenerator').then(module => ({ default: module.HashGenerator })));
const UnitConverter = lazy(() => import('./components/tools/UnitConverter').then(module => ({ default: module.UnitConverter })));
const TextCaseConverter = lazy(() => import('./components/tools/TextCaseConverter').then(module => ({ default: module.TextCaseConverter })));
const QrGenerator = lazy(() => import('./components/tools/QrGenerator').then(module => ({ default: module.QrGenerator })));
const PasswordGenerator = lazy(() => import('./components/tools/PasswordGenerator').then(module => ({ default: module.PasswordGenerator })));
const PasswordStrengthChecker = lazy(() => import('./components/tools/PasswordStrengthChecker').then(module => ({ default: module.PasswordStrengthChecker })));
const LoremIpsumGenerator = lazy(() => import('./components/tools/LoremIpsumGenerator').then(module => ({ default: module.LoremIpsumGenerator })));
const ImageResizer = lazy(() => import('./components/tools/ImageResizer').then(module => ({ default: module.ImageResizer })));
const MarkdownTool = lazy(() => import('./components/tools/MarkdownTool').then(module => ({ default: module.MarkdownTool })));
const DiffChecker = lazy(() => import('./components/tools/DiffChecker').then(module => ({ default: module.DiffChecker })));
const ExifRemover = lazy(() => import('./components/tools/ExifRemover').then(module => ({ default: module.ExifRemover })));
const JsonToTypeScript = lazy(() => import('./components/tools/JsonToTypeScript').then(module => ({ default: module.JsonToTypeScript })));
const SqlFormatter = lazy(() => import('./components/tools/SqlFormatter').then(module => ({ default: module.SqlFormatter })));
const HtmlToMarkdown = lazy(() => import('./components/tools/HtmlToMarkdown').then(module => ({ default: module.HtmlToMarkdown })));
const PdfOrganize = lazy(() => import('./components/tools/PdfOrganize').then(module => ({ default: module.PdfOrganize })));
const TextCleaner = lazy(() => import('./components/tools/TextCleaner').then(module => ({ default: module.TextCleaner })));
const LineUtils = lazy(() => import('./components/tools/LineUtils').then(module => ({ default: module.LineUtils })));
const UrlEncoder = lazy(() => import('./components/tools/UrlEncoder').then(module => ({ default: module.UrlEncoder })));
const CsvEditor = lazy(() => import('./components/tools/CsvEditor').then(module => ({ default: module.CsvEditor })));
const DateCalculator = lazy(() => import('./components/tools/DateCalculator').then(module => ({ default: module.DateCalculator })));
const PercentageCalculator = lazy(() => import('./components/tools/PercentageCalculator').then(module => ({ default: module.PercentageCalculator })));
const LoanCalculator = lazy(() => import('./components/tools/LoanCalculator').then(module => ({ default: module.LoanCalculator })));
const BmiCalculator = lazy(() => import('./components/tools/BmiCalculator').then(module => ({ default: module.BmiCalculator })));
const ColorConverter = lazy(() => import('./components/tools/ColorConverter').then(module => ({ default: module.ColorConverter })));
const ContrastChecker = lazy(() => import('./components/tools/ContrastChecker').then(module => ({ default: module.ContrastChecker })));
const QrScanner = lazy(() => import('./components/tools/QrScanner').then(module => ({ default: module.QrScanner })));
const ScreenRecorder = lazy(() => import('./components/tools/ScreenRecorder').then(module => ({ default: module.ScreenRecorder })));
const WebFormatter = lazy(() => import('./components/tools/WebFormatter').then(module => ({ default: module.WebFormatter })));
const PrivacyRedactor = lazy(() => import('./components/tools/PrivacyRedactor').then(module => ({ default: module.PrivacyRedactor })));
const ExifViewer = lazy(() => import('./components/tools/ExifViewer').then(module => ({ default: module.ExifViewer })));
const SignatureGenerator = lazy(() => import('./components/tools/SignatureGenerator').then(module => ({ default: module.SignatureGenerator })));
const Stopwatch = lazy(() => import('./components/tools/Stopwatch').then(module => ({ default: module.Stopwatch })));
const RandomGenerator = lazy(() => import('./components/tools/RandomGenerator').then(module => ({ default: module.RandomGenerator })));
const AspectRatioCalculator = lazy(() => import('./components/tools/AspectRatioCalculator').then(module => ({ default: module.AspectRatioCalculator })));
const UnixTimestampConverter = lazy(() => import('./components/tools/UnixTimestampConverter').then(module => ({ default: module.UnixTimestampConverter })));
const NumberToWords = lazy(() => import('./components/tools/NumberToWords').then(module => ({ default: module.NumberToWords })));
const MorseCodeConverter = lazy(() => import('./components/tools/MorseCodeConverter').then(module => ({ default: module.MorseCodeConverter })));
const StringEscaper = lazy(() => import('./components/tools/StringEscaper').then(module => ({ default: module.StringEscaper })));
const Base64ToImage = lazy(() => import('./components/tools/Base64ToImage').then(module => ({ default: module.Base64ToImage })));
const ImageToBase64 = lazy(() => import('./components/tools/ImageToBase64').then(module => ({ default: module.ImageToBase64 })));
const WordCounter = lazy(() => import('./components/tools/WordCounter').then(module => ({ default: module.WordCounter })));
const SvgConverter = lazy(() => import('./components/tools/SvgConverter').then(module => ({ default: module.SvgConverter })));
const ColorPalette = lazy(() => import('./components/tools/ColorPalette').then(module => ({ default: module.ColorPalette })));
const RegexTester = lazy(() => import('./components/tools/RegexTester').then(module => ({ default: module.RegexTester })));
const ImageCropper = lazy(() => import('./components/tools/ImageCropper').then(module => ({ default: module.ImageCropper })));
const SpeechToText = lazy(() => import('./components/tools/SpeechToText').then(module => ({ default: module.SpeechToText })));
const ImageCompressor = lazy(() => import('./components/tools/ImageCompressor').then(module => ({ default: module.ImageCompressor })));
const FileHasher = lazy(() => import('./components/tools/FileHasher').then(module => ({ default: module.FileHasher })));
const JWTDecoder = lazy(() => import('./components/tools/JWTDecoder').then(module => ({ default: module.JWTDecoder })));

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

const UuidGeneratorWrapper = () => {
  return <UuidGenerator onBack={() => window.history.back()} />;
};

const JsonFormatterWrapper = () => {
  return <JsonFormatter onBack={() => window.history.back()} />;
};

const Base64ToolWrapper = () => {
  return <Base64Tool onBack={() => window.history.back()} />;
};

const HashGeneratorWrapper = () => {
  return <HashGenerator onBack={() => window.history.back()} />;
};

const UnitConverterWrapper = () => {
  return <UnitConverter onBack={() => window.history.back()} />;
};

const TextCaseConverterWrapper = () => {
  return <TextCaseConverter onBack={() => window.history.back()} />;
};

const QrGeneratorWrapper = () => {
  return <QrGenerator onBack={() => window.history.back()} />;
};

const PasswordGeneratorWrapper = () => {
  return <PasswordGenerator onBack={() => window.history.back()} />;
};

const PasswordStrengthCheckerWrapper = () => {
  return <PasswordStrengthChecker onBack={() => window.history.back()} />;
};

const LoremIpsumGeneratorWrapper = () => {
  return <LoremIpsumGenerator onBack={() => window.history.back()} />;
};

const ImageResizerWrapper = () => {
  return <ImageResizer onBack={() => window.history.back()} />;
};

const MarkdownToolWrapper = () => {
  return <MarkdownTool onBack={() => window.history.back()} />;
};

const DiffCheckerWrapper = () => {
  return <DiffChecker onBack={() => window.history.back()} />;
};

const ExifRemoverWrapper = () => {
  return <ExifRemover onBack={() => window.history.back()} />;
};

const JsonToTypeScriptWrapper = () => {
  return <JsonToTypeScript onBack={() => window.history.back()} />;
};

const SqlFormatterWrapper = () => {
  return <SqlFormatter onBack={() => window.history.back()} />;
};

const HtmlToMarkdownWrapper = () => {
  return <HtmlToMarkdown onBack={() => window.history.back()} />;
};

const PdfOrganizeWrapper = () => {
  return <PdfOrganize onBack={() => window.history.back()} />;
};

const SvgConverterWrapper = () => {
  return <SvgConverter onBack={() => window.history.back()} />;
};

const ColorPaletteWrapper = () => {
  return <ColorPalette onBack={() => window.history.back()} />;
};

const RegexTesterWrapper = () => {
  return <RegexTester onBack={() => window.history.back()} />;
};

const ImageCropperWrapper = () => {
  return <ImageCropper onBack={() => window.history.back()} />;
};

const SpeechToTextWrapper = () => {
  return <SpeechToText onBack={() => window.history.back()} />;
};

const ImageCompressorWrapper = () => {
  return <ImageCompressor onBack={() => window.history.back()} />;
};

const WordCounterWrapper = () => {
  return <WordCounter onBack={() => window.history.back()} />;
};

const TextCleanerWrapper = () => {
  return <TextCleaner onBack={() => window.history.back()} />;
};

const LineUtilsWrapper = () => {
  return <LineUtils onBack={() => window.history.back()} />;
};

const UrlEncoderWrapper = () => {
  return <UrlEncoder onBack={() => window.history.back()} />;
};

const CsvEditorWrapper = () => {
  return <CsvEditor onBack={() => window.history.back()} />;
};

const DateCalculatorWrapper = () => {
  return <DateCalculator onBack={() => window.history.back()} />;
};

const PercentageCalculatorWrapper = () => {
  return <PercentageCalculator onBack={() => window.history.back()} />;
};

const LoanCalculatorWrapper = () => {
  return <LoanCalculator onBack={() => window.history.back()} />;
};

const BmiCalculatorWrapper = () => {
  return <BmiCalculator onBack={() => window.history.back()} />;
};

const ColorConverterWrapper = () => {
  return <ColorConverter onBack={() => window.history.back()} />;
};

const ContrastCheckerWrapper = () => {
  return <ContrastChecker onBack={() => window.history.back()} />;
};

const QrScannerWrapper = () => {
  return <QrScanner onBack={() => window.history.back()} />;
};

const ScreenRecorderWrapper = () => {
  return <ScreenRecorder onBack={() => window.history.back()} />;
};

const WebFormatterWrapper = () => {
  return <WebFormatter onBack={() => window.history.back()} />;
};

const PrivacyRedactorWrapper = () => {
  return <PrivacyRedactor onBack={() => window.history.back()} />;
};

const ExifViewerWrapper = () => {
  return <ExifViewer onBack={() => window.history.back()} />;
};

const SignatureGeneratorWrapper = () => {
  return <SignatureGenerator onBack={() => window.history.back()} />;
};

const StopwatchWrapper = () => {
  return <Stopwatch onBack={() => window.history.back()} />;
};

const RandomGeneratorWrapper = () => {
  return <RandomGenerator onBack={() => window.history.back()} />;
};

const AspectRatioCalculatorWrapper = () => {
  return <AspectRatioCalculator onBack={() => window.history.back()} />;
};

const UnixTimestampConverterWrapper = () => {
  return <UnixTimestampConverter onBack={() => window.history.back()} />;
};

const NumberToWordsWrapper = () => {
  return <NumberToWords onBack={() => window.history.back()} />;
};

const MorseCodeConverterWrapper = () => {
  return <MorseCodeConverter onBack={() => window.history.back()} />;
};

const StringEscaperWrapper = () => {
  return <StringEscaper onBack={() => window.history.back()} />;
};

const Base64ToImageWrapper = () => {
  return <Base64ToImage onBack={() => window.history.back()} />;
};

const ImageToBase64Wrapper = () => {
  return <ImageToBase64 onBack={() => window.history.back()} />;
};

const FileHasherWrapper = () => {
  return <FileHasher onBack={() => window.history.back()} />;
};

const JWTDecoderWrapper = () => {
  return <JWTDecoder onBack={() => window.history.back()} />;
};

// Helper function to map tool IDs to paths
function getToolPath(toolId: ToolID): string | null {
  // Intelligent Document
  if (toolId === ToolID.CHAT_WITH_DOC) return '/tools/chat-with-doc';

  // Audio Tools
  if (toolId === ToolID.TEXT_TO_SPEECH) return '/tools/text-to-speech';

  // Data Tools
  if (
    [ToolID.JSON_TO_CSV, ToolID.CSV_TO_JSON, ToolID.XML_TO_JSON, ToolID.JSON_TO_XML, ToolID.YAML_TO_JSON, ToolID.JSON_TO_YAML].includes(
      toolId
    )
  ) {
    return `/tools/data-converter/${toolId}`;
  }

  // Developer Tools
  if (toolId === ToolID.JWT_SECRET_GENERATOR) {
    return '/tools/jwt-secret-generator';
  }
  if (toolId === ToolID.UUID_GENERATOR) {
    return '/tools/uuid-generator';
  }
  if (toolId === ToolID.JSON_FORMATTER) {
    return '/tools/json-formatter';
  }
  if (toolId === ToolID.BASE64_ENCODER) {
    return '/tools/base64-tool';
  }
  if (toolId === ToolID.HASH_GENERATOR) {
    return '/tools/hash-generator';
  }
  if (toolId === ToolID.UNIT_CONVERTER) {
    return '/tools/unit-converter';
  }
  if (toolId === ToolID.TEXT_CASE_CONVERTER) {
    return '/tools/text-case-converter';
  }
  if (toolId === ToolID.QR_GENERATOR) {
    return '/tools/qr-generator';
  }
  if (toolId === ToolID.PASSWORD_GENERATOR) {
    return '/tools/password-generator';
  }
  if (toolId === ToolID.PASSWORD_STRENGTH_CHECKER) {
    return '/tools/password-strength';
  }
  if (toolId === ToolID.LOREM_IPSUM_GENERATOR) {
    return '/tools/lorem-ipsum-generator';
  }
  if (toolId === ToolID.IMAGE_RESIZER) {
    return '/tools/image-resizer';
  }
  if (toolId === ToolID.MARKDOWN_TOOL) {
    return '/tools/markdown-editor';
  }
  if (toolId === ToolID.DIFF_CHECKER) {
    return '/tools/diff-checker';
  }
  if (toolId === ToolID.EXIF_REMOVER) {
    return '/tools/exif-remover';
  }
  if (toolId === ToolID.JSON_TO_TYPESCRIPT) {
    return '/tools/json-to-typescript';
  }
  if (toolId === ToolID.SQL_FORMATTER) {
    return '/tools/sql-formatter';
  }
  if (toolId === ToolID.TEXT_CLEANER) {
    return '/tools/text-cleaner';
  }
  if (toolId === ToolID.LINE_UTILS) {
    return '/tools/line-utils';
  }
  if (toolId === ToolID.URL_ENCODER) {
    return '/tools/url-encoder';
  }
  if (toolId === ToolID.CSV_EDITOR) {
    return '/tools/csv-editor';
  }
  if (toolId === ToolID.DATE_CALCULATOR) {
    return '/tools/date-calculator';
  }
  if (toolId === ToolID.PERCENTAGE_CALCULATOR) {
    return '/tools/percentage-calculator';
  }
  if (toolId === ToolID.LOAN_CALCULATOR) {
    return '/tools/loan-calculator';
  }
  if (toolId === ToolID.BMI_CALCULATOR) {
    return '/tools/bmi-calculator';
  }
  if (toolId === ToolID.COLOR_CONVERTER) {
    return '/tools/color-converter';
  }
  if (toolId === ToolID.COLOR_CONTRAST_CHECKER) {
    return '/tools/contrast-checker';
  }
  if (toolId === ToolID.QR_SCANNER) {
    return '/tools/qr-scanner';
  }
  if (toolId === ToolID.SCREEN_RECORDER) {
    return '/tools/screen-recorder';
  }
  if (toolId === ToolID.WEB_FORMATTER) {
    return '/tools/web-formatter';
  }
  if (toolId === ToolID.PRIVACY_REDACTOR) {
    return '/tools/privacy-redactor';
  }
  if (toolId === ToolID.EXIF_VIEWER) {
    return '/tools/exif-viewer';
  }
  if (toolId === ToolID.SIGNATURE_GENERATOR) {
    return '/tools/signature-pad';
  }
  if (toolId === ToolID.STOPWATCH) {
    return '/tools/stopwatch';
  }
  if (toolId === ToolID.RANDOM_GENERATOR) {
    return '/tools/random-generator';
  }
  if (toolId === ToolID.ASPECT_RATIO_CALCULATOR) {
    return '/tools/aspect-ratio-calculator';
  }
  if (toolId === ToolID.UNIX_TIMESTAMP_CONVERTER) {
    return '/tools/unix-timestamp-converter';
  }
  if (toolId === ToolID.NUMBER_TO_WORDS) {
    return '/tools/number-to-words';
  }
  if (toolId === ToolID.MORSE_CODE_CONVERTER) {
    return '/tools/morse-code';
  }
  if (toolId === ToolID.STRING_ESCAPER) {
    return '/tools/string-escaper';
  }
  if (toolId === ToolID.BASE64_TO_IMAGE) {
    return '/tools/base64-to-image';
  }
  if (toolId === ToolID.IMAGE_TO_BASE64) {
    return '/tools/image-to-base64';
  }
  if (toolId === ToolID.FILE_HASHER) {
    return '/tools/file-hasher';
  }
  if (toolId === ToolID.JWT_DECODER) {
    return '/tools/jwt-decoder';
  }
  if (toolId === ToolID.WORD_COUNTER) {
    return '/tools/word-counter';
  }
  if (toolId === ToolID.HTML_TO_MARKDOWN) {
    return '/tools/html-to-markdown';
  }
  if (toolId === ToolID.SVG_CONVERTER) {
    return '/tools/svg-converter';
  }
  if (toolId === ToolID.COLOR_PALETTE) {
    return '/tools/color-palette';
  }
  if (toolId === ToolID.REGEX_TESTER) {
    return '/tools/regex-tester';
  }
  if (toolId === ToolID.IMAGE_CROPPER) {
    return '/tools/image-cropper';
  }
  if (toolId === ToolID.SPEECH_TO_TEXT) {
    return '/tools/voice-transcriber';
  }
  if (toolId === ToolID.IMAGE_COMPRESSOR) {
    return '/tools/image-compressor';
  }

  // Client/Image Tools
  if (toolId === ToolID.IMAGE_CONVERTER) return '/tools/image-converter';

  // Image/Scan to Text (AI)
  if (toolId === ToolID.SMART_OCR) return '/tools/smart-ocr';

  // Specific PDF Organize
  if (toolId === ToolID.PDF_ORGANIZE) return '/tools/pdf-organize';

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
        path: 'tools/file-hasher',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FileHasherWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/jwt-decoder',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JWTDecoderWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/privacy-redactor',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyRedactorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/exif-viewer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExifViewerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/signature-pad',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignatureGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/web-formatter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <WebFormatterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/screen-recorder',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ScreenRecorderWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/contrast-checker',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContrastCheckerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/password-strength',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PasswordStrengthCheckerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/string-escaper',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StringEscaperWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/base64-to-image',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Base64ToImageWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/morse-code',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MorseCodeConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/number-to-words',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NumberToWordsWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/aspect-ratio-calculator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AspectRatioCalculatorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/unix-timestamp-converter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UnixTimestampConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/stopwatch',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StopwatchWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/random-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RandomGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/color-converter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ColorConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/qr-scanner',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QrScannerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/bmi-calculator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BmiCalculatorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/loan-calculator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoanCalculatorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/csv-editor',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CsvEditorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/date-calculator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DateCalculatorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/percentage-calculator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PercentageCalculatorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/line-utils',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LineUtilsWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/url-encoder',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UrlEncoderWrapper />
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
      {
        path: 'tools/uuid-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UuidGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/json-formatter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JsonFormatterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/base64-tool',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Base64ToolWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/hash-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HashGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/unit-converter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UnitConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/text-case-converter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TextCaseConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/qr-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QrGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/password-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PasswordGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/lorem-ipsum-generator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoremIpsumGeneratorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/image-resizer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ImageResizerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/markdown-editor',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarkdownToolWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/diff-checker',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DiffCheckerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/exif-remover',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExifRemoverWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/json-to-typescript',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JsonToTypeScriptWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/sql-formatter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SqlFormatterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/html-to-markdown',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HtmlToMarkdownWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/pdf-organize',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PdfOrganizeWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/svg-converter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SvgConverterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/color-palette',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ColorPaletteWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/regex-tester',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegexTesterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/image-cropper',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ImageCropperWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/voice-transcriber',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SpeechToTextWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/image-compressor',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ImageCompressorWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/word-counter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <WordCounterWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/text-cleaner',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TextCleanerWrapper />
          </Suspense>
        ),
      },
      {
        path: 'tools/image-to-base64',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ImageToBase64Wrapper />
          </Suspense>
        ),
      },
    ],
  },
]);
