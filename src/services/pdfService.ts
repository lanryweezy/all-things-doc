import {
  mergePdfs as backendMergePdfs,
  splitPdf as backendSplitPdf,
  compressPdf as backendCompressPdf,
  extractTextFromPdf as backendExtractTextFromPdf,
} from './backendService';

// Check if we have a backend available
const BACKEND_AVAILABLE = !!import.meta.env.VITE_BACKEND_URL;

// Use backend for PDF operations if available, otherwise client-side
export const mergePdfs = async (files: File[]): Promise<Blob> => {
  if (BACKEND_AVAILABLE) {
    try {
      return await backendMergePdfs(files);
    } catch (error) {
      console.warn('Backend PDF merge failed, falling back to client-side processing:', error);
    }
  }

  const { PDFDocument } = await import('pdf-lib');
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const splitPdf = async (file: File, splitPoints: number[]): Promise<Blob> => {
  if (BACKEND_AVAILABLE) {
    try {
      return await backendSplitPdf(file, splitPoints);
    } catch (error) {
      console.warn('Backend PDF split failed, falling back to client-side processing:', error);
    }
  }

  const { PDFDocument } = await import('pdf-lib');
  const JSZip = (await import('jszip')).default;
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const zip = new JSZip();
  const sortedPoints = [...new Set([0, ...splitPoints, totalPages])].sort((a, b) => a - b);

  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const start = sortedPoints[i];
    const end = sortedPoints[i + 1];
    if (start >= end) continue;

    const newPdf = await PDFDocument.create();
    const pagesToCopy = Array.from({ length: end - start }, (_, idx) => start + idx);
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
    copiedPages.forEach(page => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    zip.file(`part-${i + 1}.pdf`, pdfBytes);
  }

  return await zip.generateAsync({ type: 'blob' });
};

export const rotatePdf = async (file: File, rotation: number): Promise<Uint8Array> => {
  const { PDFDocument, degrees } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  });

  return await pdfDoc.save();
};

export const imageToPdf = async (file: File): Promise<Uint8Array> => {
  const { jsPDF } = await import('jspdf');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No ctx');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'l' : 'p',
          unit: 'px',
          format: [img.width, img.height],
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);
        const arrayBuffer = pdf.output('arraybuffer');
        resolve(new Uint8Array(arrayBuffer));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const protectPdf = async (file: File, password: string): Promise<Uint8Array> => {
  const { PDFDocument } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  return await pdfDoc.save({
    userPassword: password,
    ownerPassword: password,
  });
};

export const decryptPdf = async (file: File, password: string): Promise<Uint8Array> => {
  const { PDFDocument } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { password });

  return await pdfDoc.save();
};

export const addPageNumbers = async (file: File, position: string): Promise<Uint8Array> => {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const text = `Page ${index + 1} of ${pages.length}`;
    const textSize = 10;
    const textWidth = font.widthOfTextAtSize(text, textSize);

    let x = width / 2 - textWidth / 2;
    let y = 20;

    if (position === 'Bottom Left') x = 30;
    if (position === 'Bottom Right') x = width - textWidth - 30;

    page.drawText(text, {
      x,
      y,
      size: textSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  return await pdfDoc.save();
};

export const repairPdf = async (file: File): Promise<Uint8Array> => {
  const { PDFDocument } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();
  // Simply loading and saving often fixes structural issues
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return await pdfDoc.save();
};

export const watermarkPdf = async (file: File, text: string): Promise<Uint8Array> => {
  const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  pages.forEach(page => {
    const { width, height } = page.getSize();
    const textSize = 60;
    const textWidth = font.widthOfTextAtSize(text, textSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: textSize,
      font,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: degrees(45),
    });
  });

  return await pdfDoc.save();
};

export const compressPdf = async (file: File): Promise<Blob> => {
  if (BACKEND_AVAILABLE) {
    try {
      return await backendCompressPdf(file);
    } catch (error) {
      console.warn(
        'Backend PDF compression failed, falling back to client-side processing:',
        error
      );
      throw error;
    }
  }

  throw new Error('Backend service not available and client-side processing not implemented');
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  if (BACKEND_AVAILABLE) {
    try {
      return await backendExtractTextFromPdf(file);
    } catch (error) {
      console.warn(
        'Backend PDF text extraction failed, falling back to client-side processing:',
        error
      );
    }
  }

  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};
