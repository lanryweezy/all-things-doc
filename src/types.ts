import { LucideIcon } from 'lucide-react';

export enum ToolID {
  // AI Tools (Text Analysis)
  MAGIC_SUMMARIZER = 'magic-summarizer',
  SMART_OCR = 'smart-ocr',
  UNIVERSAL_TRANSLATOR = 'universal-translator',
  CODE_MORPH = 'code-morph',
  GRAMMAR_POLISH = 'grammar-polish',

  // Intelligent Document
  CHAT_WITH_DOC = 'chat-with-doc',

  // Audio Tools
  TEXT_TO_SPEECH = 'text-to-speech',

  // AI PDF Conversion (Extraction)
  PDF_TO_WORD = 'pdf-to-word',
  PDF_TO_EXCEL = 'pdf-to-excel',
  PDF_TO_POWERPOINT = 'pdf-to-powerpoint',
  PDF_OCR = 'pdf-ocr',
  PDF_BANK_STATEMENT_CONVERTER = 'pdf-bank-statement-converter',

  // Client/Image Tools
  IMAGE_CONVERTER = 'image-converter',

  // Data Tools
  JSON_TO_CSV = 'json-to-csv',
  CSV_TO_JSON = 'csv-to-json',
  XML_TO_JSON = 'xml-to-json',
  JSON_TO_XML = 'json-to-xml',

  // Office Tools
  WORD_TO_EXCEL = 'word-to-excel',
  EXCEL_TO_WORD = 'excel-to-word',
  // New Office Tools
  PPT_TO_WORD = 'ppt-to-word',
  WORD_TO_PPT = 'word-to-ppt',
  EXCEL_TO_CSV = 'excel-to-csv',
  CSV_TO_EXCEL = 'csv-to-excel',
  TEXT_TO_WORD = 'text-to-word',
  WORD_TO_TEXT = 'word-to-text',
  WORD_TO_JPG = 'word-to-jpg',
  PPT_TO_JPG = 'ppt-to-jpg',
  EXCEL_TO_JPG = 'excel-to-jpg',
  COMPRESS_WORD = 'compress-word',
  COMPRESS_EXCEL = 'compress-excel',
  COMPRESS_PPT = 'compress-ppt',
  MERGE_WORD = 'merge-word',

  // PDF Organize
  PDF_MERGE = 'pdf-merge',
  PDF_SPLIT = 'pdf-split',
  PDF_ORGANIZE = 'pdf-organize', // Sort/Delete
  PDF_SCAN = 'pdf-scan',

  // PDF Optimize
  PDF_COMPRESS = 'pdf-compress',
  PDF_REPAIR = 'pdf-repair',

  // Convert TO PDF
  GENERIC_TO_PDF = 'generic-to-pdf', // New generic converter
  WORD_TO_PDF = 'word-to-pdf',
  POWERPOINT_TO_PDF = 'powerpoint-to-pdf',
  EXCEL_TO_PDF = 'excel-to-pdf',
  JPG_TO_PDF = 'jpg-to-pdf',
  HTML_TO_PDF = 'html-to-pdf',

  // Convert FROM PDF (Binary/Simulated)
  PDF_TO_JPG = 'pdf-to-jpg',
  PDF_TO_PNG = 'pdf-to-png',
  PDF_TO_PDFA = 'pdf-to-pdfa',

  // PDF Edit
  PDF_EDIT = 'pdf-edit',
  PDF_ROTATE = 'pdf-rotate',
  PDF_PAGE_NUMBERS = 'pdf-page-numbers',
  PDF_WATERMARK = 'pdf-watermark',
  PDF_CROP = 'pdf-crop',

  // PDF Security
  PDF_PROTECT = 'pdf-protect',
  PDF_UNLOCK = 'pdf-unlock',
  PDF_SIGN = 'pdf-sign',
  PDF_REDACT = 'pdf-redact',
  PDF_COMPARE = 'pdf-compare',

  // Developer Tools
  JWT_SECRET_GENERATOR = 'jwt-secret-generator',
  UUID_GENERATOR = 'uuid-generator',
  HASH_GENERATOR = 'hash-generator',
  BASE64_ENCODER = 'base64-encoder',
  JSON_FORMATTER = 'json-formatter',
  QR_GENERATOR = 'qr-generator',
}

export enum ToolCategory {
  AI_TOOLS = 'AI Intelligence',
  PDF_TOOLS = 'PDF Tools',
  OFFICE_TOOLS = 'Office Tools',
  DEVELOPER_TOOLS = 'Developer Tools',
  MEDIA_TOOLS = 'Image & Audio',
}

export interface ToolConfig {
  id: ToolID;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind bg color class
  category: ToolCategory;
  keywords?: string[]; // SEO keywords for better discoverability
  seoTitle?: string; // SEO-optimized page title
  seoDescription?: string; // SEO-optimized meta description
  longDescription?: string; // Extended description for SEO and detailed views
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export interface ImageFile {
  file: File;
  preview: string;
}
