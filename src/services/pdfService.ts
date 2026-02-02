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