import {
  mergePdfs as backendMergePdfs,
  splitPdf as backendSplitPdf,
  compressPdf as backendCompressPdf,
  extractTextFromPdf as backendExtractTextFromPdf
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
      // Fallback to client-side processing would go here
      throw error;
    }
  }

  // Fallback to client-side processing (existing logic would go here)
  throw new Error('Backend service not available and client-side processing not implemented');
};

export const splitPdf = async (file: File, splitPoints: number[]): Promise<Blob> => {
  if (BACKEND_AVAILABLE) {
    try {
      return await backendSplitPdf(file, splitPoints);
    } catch (error) {
      console.warn('Backend PDF split failed, falling back to client-side processing:', error);
      throw error;
    }
  }

  throw new Error('Backend service not available and client-side processing not implemented');
};

export const imageToPdf = async (file: File): Promise<Uint8Array> => {
  const { jsPDF } = await import('jspdf');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'l' : 'p',
          unit: 'px',
          format: [img.width, img.height]
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

export const compressPdf = async (file: File): Promise<Blob> => {
  if (BACKEND_AVAILABLE) {
    try {
      return await backendCompressPdf(file);
    } catch (error) {
      console.warn('Backend PDF compression failed, falling back to client-side processing:', error);
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
      console.warn('Backend PDF text extraction failed, falling back to client-side processing:', error);
      throw error;
    }
  }

  throw new Error('Backend service not available and client-side processing not implemented');
};