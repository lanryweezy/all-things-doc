import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { fileToBase64 } from './imageService';

// Utility function to load a PDF from a File object
export const loadPdf = async (file: File): Promise<PDFDocument> => {
  const arrayBuffer = await file.arrayBuffer();
  return PDFDocument.load(arrayBuffer);
};

// Merge multiple PDFs into one
export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const pdf = await loadPdf(file);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
};

// Split a PDF into multiple parts
export const splitPdf = async (
  file: File,
  splitPoints: number[]
): Promise<Uint8Array[]> => {
  const pdf = await loadPdf(file);
  const parts: Uint8Array[] = [];
  
  // Add the first part (from start to first split point)
  const firstPart = await PDFDocument.create();
  const firstPages = await firstPart.copyPages(pdf, Array.from({ length: splitPoints[0] }, (_, i) => i));
  firstPages.forEach((page) => firstPart.addPage(page));
  parts.push(await firstPart.save());
  
  // Add middle parts
  for (let i = 0; i < splitPoints.length - 1; i++) {
    const part = await PDFDocument.create();
    const pages = await part.copyPages(pdf, Array.from({ length: splitPoints[i + 1] - splitPoints[i] }, (_, j) => splitPoints[i] + j));
    pages.forEach((page) => part.addPage(page));
    parts.push(await part.save());
  }
  
  // Add the last part (from last split point to end)
  const lastPart = await PDFDocument.create();
  const lastPages = await lastPart.copyPages(pdf, Array.from({ length: pdf.getPageCount() - splitPoints[splitPoints.length - 1] }, (_, i) => splitPoints[splitPoints.length - 1] + i));
  lastPages.forEach((page) => lastPart.addPage(page));
  parts.push(await lastPart.save());
  
  return parts;
};

// Compress a PDF by reducing image quality
export const compressPdf = async (
  file: File,
  compressionLevel: 'Extreme' | 'Recommended' | 'Less' = 'Recommended'
): Promise<Uint8Array> => {
  const pdf = await loadPdf(file);
  
  // Compression quality mapping
  const qualityMap = {
    'Extreme': 0.3,
    'Recommended': 0.5,
    'Less': 0.7
  };
  
  const quality = qualityMap[compressionLevel];
  
  // Note: Actual image compression would require more complex processing
  // This is a simplified version for demonstration
  // In a real implementation, you would need to process each image in the PDF
  
  return await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    compress: true
  });
};

// Add password protection to a PDF
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const pdf = await loadPdf(file);
  pdf.protect(
    {
      permissions: {
        printing: 'low',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false,
      },
      ownerPassword: password,
      userPassword: password,
    }
  );
  
  return await pdf.save();
};

// Remove password protection from a PDF
export const unlockPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
  
  // Note: pdf-lib doesn't directly support removing password protection
  // This would require creating a new PDF and copying content over
  const unlockedPdf = await PDFDocument.create();
  const copiedPages = await unlockedPdf.copyPages(pdf, pdf.getPageIndices());
  copiedPages.forEach((page) => unlockedPdf.addPage(page));
  
  return await unlockedPdf.save();
};

// Add watermark to a PDF
export const addWatermark = async (
  file: File,
  watermarkText: string
): Promise<Uint8Array> => {
  const pdf = await loadPdf(file);
  const pages = pdf.getPages();
  
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 2 - (watermarkText.length * 15) / 2,
      y: height / 2,
      size: 50,
      font: font,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: { type: 'degrees', angle: 45 }
    });
  }
  
  return await pdf.save();
};

// Rotate pages in a PDF
export const rotatePdf = async (
  file: File,
  rotation: number // 90, 180, 270
): Promise<Uint8Array> => {
  const pdf = await loadPdf(file);
  const pages = pdf.getPages();
  
  pages.forEach((page) => {
    page.setRotation(page.getRotation() + rotation);
  });
  
  return await pdf.save();
};

// Add page numbers to a PDF
export const addPageNumbers = async (
  file: File,
  position: 'Bottom Left' | 'Bottom Center' | 'Bottom Right' = 'Bottom Center'
): Promise<Uint8Array> => {
  const pdf = await loadPdf(file);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const pageNumber = (index + 1).toString();
    
    let x = 0;
    switch (position) {
      case 'Bottom Left':
        x = 30;
        break;
      case 'Bottom Center':
        x = width / 2 - 10;
        break;
      case 'Bottom Right':
        x = width - 30;
        break;
    }
    
    page.drawText(pageNumber, {
      x: x,
      y: 30,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  });
  
  return await pdf.save();
};

// Redact content in a PDF (simplified implementation)
export const redactPdf = async (
  file: File,
  redactAreas: { pageIndex: number; x: number; y: number; width: number; height: number }[]
): Promise<Uint8Array> => {
  const pdf = await loadPdf(file);
  
  // For each redact area, draw a black rectangle
  redactAreas.forEach((area) => {
    const page = pdf.getPage(area.pageIndex);
    page.drawRectangle({
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      color: rgb(0, 0, 0),
    });
  });
  
  return await pdf.save();
};

// Compare two PDFs (simplified implementation)
export const comparePdfs = async (
  file1: File,
  file2: File
): Promise<{ 
  differences: number; 
  report: string; 
  comparisonPdf: Uint8Array 
}> => {
  const pdf1 = await loadPdf(file1);
  const pdf2 = await loadPdf(file2);
  
  const differences = Math.abs(pdf1.getPageCount() - pdf2.getPageCount());
  const report = `PDF 1 has ${pdf1.getPageCount()} pages, PDF 2 has ${pdf2.getPageCount()} pages. Differences: ${differences}`;
  
  // Create a comparison report PDF
  const comparisonPdf = await PDFDocument.create();
  const font = await comparisonPdf.embedFont(StandardFonts.Helvetica);
  
  const page = comparisonPdf.addPage();
  page.drawText('PDF Comparison Report', { x: 50, y: 750, size: 20, font });
  page.drawText(report, { x: 50, y: 700, size: 12, font });
  
  return {
    differences,
    report,
    comparisonPdf: await comparisonPdf.save()
  };
};

// Convert image to PDF
export const imageToPdf = async (file: File): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const base64 = await fileToBase64(file);
  
  let imageEmbed;
  if (file.type.includes('jpeg') || file.type.includes('jpg')) {
    imageEmbed = await pdfDoc.embedJpg(base64);
  } else if (file.type.includes('png')) {
    imageEmbed = await pdfDoc.embedPng(base64);
  } else {
    throw new Error('Unsupported image format');
  }
  
  const page = pdfDoc.addPage([imageEmbed.width, imageEmbed.height]);
  page.drawImage(imageEmbed, {
    x: 0,
    y: 0,
    width: imageEmbed.width,
    height: imageEmbed.height,
  });
  
  return await pdfDoc.save();
};

// Convert PDF to images (simplified implementation)
export const pdfToImages = async (
  file: File,
  format: 'jpeg' | 'png' = 'jpeg'
): Promise<string[]> => {
  // This would require pdfjs-dist for actual implementation
  // For now, we'll return a placeholder
  const pdf = await loadPdf(file);
  const pageCount = pdf.getPageCount();
  
  // In a real implementation, you would render each page to an image
  // This is just a placeholder to show the concept
  return Array(pageCount).fill('').map((_, i) => `data:image/${format};base64,placeholder_for_page_${i + 1}`);
};

// Export all functions
export default {
  mergePdfs,
  splitPdf,
  compressPdf,
  protectPdf,
  unlockPdf,
  addWatermark,
  rotatePdf,
  addPageNumbers,
  redactPdf,
  comparePdfs,
  imageToPdf,
  pdfToImages,
  loadPdf
};