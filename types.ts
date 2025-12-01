import { LucideIcon } from 'lucide-react';

export enum ToolID {
  // AI Tools (Text Analysis)
  MAGIC_SUMMARIZER = 'magic-summarizer',
  SMART_OCR = 'smart-ocr',
  UNIVERSAL_TRANSLATOR = 'universal-translator',
  CODE_MORPH = 'code-morph',
  GRAMMAR_POLISH = 'grammar-polish',

  // AI PDF Conversion (Extraction)
  PDF_TO_WORD = 'pdf-to-word',
  PDF_TO_EXCEL = 'pdf-to-excel',
  PDF_TO_POWERPOINT = 'pdf-to-powerpoint',
  PDF_OCR = 'pdf-ocr',

  // Client/Image Tools
  IMAGE_CONVERTER = 'image-converter',

  // PDF Organize
  PDF_MERGE = 'pdf-merge',
  PDF_SPLIT = 'pdf-split',
  PDF_ORGANIZE = 'pdf-organize', // Sort/Delete
  PDF_SCAN = 'pdf-scan',

  // PDF Optimize
  PDF_COMPRESS = 'pdf-compress',
  PDF_REPAIR = 'pdf-repair',

  // Convert TO PDF
  WORD_TO_PDF = 'word-to-pdf',
  POWERPOINT_TO_PDF = 'powerpoint-to-pdf',
  EXCEL_TO_PDF = 'excel-to-pdf',
  JPG_TO_PDF = 'jpg-to-pdf',
  HTML_TO_PDF = 'html-to-pdf',

  // Convert FROM PDF (Binary/Simulated)
  PDF_TO_JPG = 'pdf-to-jpg',
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
}

export enum ToolCategory {
  ORGANIZE_PDF = 'Organize PDF',
  CONVERT_FROM_PDF = 'Convert from PDF',
  CONVERT_TO_PDF = 'Convert to PDF',
  OPTIMIZE_PDF = 'Optimize PDF',
  EDIT_PDF = 'Edit PDF',
  SECURITY_PDF = 'PDF Security',
  AI_INTELLIGENCE = 'AI Intelligence',
  IMAGE_TOOLS = 'Image Tools',
}

export interface ToolConfig {
  id: ToolID;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind bg color class
  category: ToolCategory;
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