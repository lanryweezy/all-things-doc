// For Vercel deployment, the backend routes are handled by the same domain
// The vercel.json routes /pdf/* and /ai/* to the Python backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

interface ApiError {
  detail: string;
}

// Function to get the backend URL
export const getBackendUrl = (): string => {
  return BACKEND_URL;
};

// PDF Processing Functions
export const mergePdfs = async (files: File[]): Promise<Blob> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await fetch(`${BACKEND_URL}/pdf/merge`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to merge PDFs');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw error;
  }
};

export const splitPdf = async (file: File, splitPoints: number[]): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('split_points', splitPoints.join(','));

  try {
    const response = await fetch(`${BACKEND_URL}/pdf/split`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to split PDF');
    }

    return await response.blob(); // Expecting a ZIP file as a Blob
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw error;
  }
};

export const compressPdf = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BACKEND_URL}/pdf/compress`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to compress PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw error;
  }
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BACKEND_URL}/pdf/extract-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to extract text from PDF');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

// AI Processing Functions
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/ai/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(text)}`,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to summarize text');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};

export const translateText = async (text: string, targetLanguage: string = 'es'): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/ai/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(text)}&target_language=${targetLanguage}`,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to translate text');
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

export const performOcrImage = async (file: File, language: string = 'eng'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);

  try {
    const response = await fetch(`${BACKEND_URL}/ai/ocr/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to perform OCR on image');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error performing OCR on image:', error);
    throw error;
  }
};

export const performOcrPdf = async (file: File, language: string = 'eng'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);

  try {
    const response = await fetch(`${BACKEND_URL}/ai/ocr/pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Failed to perform OCR on PDF');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error performing OCR on PDF:', error);
    throw error;
  }
};