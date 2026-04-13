import { GoogleGenAI, Modality } from '@google/genai';
import {
  summarizeText as backendSummarize,
  translateText as backendTranslate,
  performOcrImage as backendOcrImage,
  performOcrPdf as backendOcrPdf,
} from './backendService';
import { isBackendAvailable } from './apiCheck';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const MODEL_NAME = 'gemini-2.5-flash';

export const isApiAvailable = () => !!ai || isBackendAvailable();

// Use backend for summarization if available, otherwise Gemini
export const summarizeText = async (text: string): Promise<string> => {
  if (!text) return '';

  if (isBackendAvailable()) {
    try {
      return await backendSummarize(text);
    } catch (error) {
      console.warn('Backend summarization failed, falling back to demo mode:', error);
      return `Backend processing error. In real mode, this would summarize: ${text.substring(0, 50)}...`;
    }
  }

  if (!ai) {
    return 'Error: Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your environment variables to enable AI features.';
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Please summarize the following text concisely, highlighting the key points:\n\n${text}`,
  });
  return response.text || 'No summary generated.';
};

// Use backend for translation if available, otherwise Gemini
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text) return '';

  if (isBackendAvailable()) {
    try {
      return await backendTranslate(text, targetLanguage);
    } catch (error) {
      console.warn('Backend translation failed, falling back to demo mode:', error);
      return `Backend processing error. In real mode, this would translate to: ${targetLanguage}`;
    }
  }

  if (!ai) {
    return `Error: Gemini API Key is missing. Cannot translate to ${targetLanguage}. Please add your API key.`;
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Translate the following text into ${targetLanguage}. Only provide the translated text, no preamble:\n\n${text}`,
  });
  return response.text || 'Translation failed.';
};

// Use backend for OCR if available, otherwise Gemini
export const performOCR = async (imageBase64: string, mimeType: string): Promise<string> => {
  if (isBackendAvailable()) {
    try {
      // Convert base64 to blob for backend processing
      const byteCharacters = atob(imageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], 'image', { type: mimeType });

      return await backendOcrImage(file);
    } catch (error) {
      console.warn('Backend OCR failed, falling back to demo mode:', error);
      return 'Backend processing error. In real mode, this would perform OCR.';
    }
  }

  if (!ai) {
    return 'Error: Gemini API Key is missing. OCR requires an active AI connection. Please add your API key.';
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        {
          text: 'Extract all text visible in this image. Preserve the formatting as much as possible.',
        },
      ],
    },
  });
  return response.text || 'No text found in image.';
};

// Placeholder functions for other operations
export const correctGrammar = async (text: string): Promise<string> => {
  if (!text) return '';
  if (!ai) {
    return 'Demo mode: AI grammar correction requires API key. Please add your Gemini API key to use this feature.';
  }
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Correct the grammar and spelling of the following text. Improve clarity where necessary but maintain the original meaning. Only provide the corrected text:\n\n${text}`,
  });
  return response.text || 'Correction failed.';
};

export const convertCode = async (code: string, targetLang: string): Promise<string> => {
  if (!code) return '';
  if (!ai) {
    return `Demo mode: AI code conversion requires API key. In real mode, this would convert to: ${targetLang}`;
  }
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Convert the following code to ${targetLang}. Provide only the code block, no explanations:\n\n${code}`,
  });
  return response.text || 'Code conversion failed.';
};

export const processPdf = async (
  pdfBase64: string,
  mode: 'WORD' | 'EXCEL' | 'PPT' | 'OCR' | 'BANK_STATEMENT',
  outputFormat: 'markdown' | 'text' = 'markdown',
  advanced: boolean = false
): Promise<string> => {

  if (mode === 'OCR' && BACKEND_AVAILABLE) {
    try {
      // Convert base64 to blob for backend processing
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const file = new File([blob], 'document.pdf', { type: 'application/pdf' });

      return await backendOcrPdf(file);
    } catch (error) {
      console.warn('Backend PDF OCR failed, falling back to demo mode:', error);
      return 'Backend processing error. In real mode, this would process PDF with OCR.';
    }
  }

  if (!ai) {
    return `Demo mode: AI PDF processing requires API key. In real mode, this would process PDF as: ${mode}`;
  }

  let prompt = '';

  switch (mode) {
    case 'WORD':
      if (outputFormat === 'markdown') {
        prompt =
          'Convert the content of this PDF into structured Markdown. Preserve headings, bullet points, and paragraph structure. Return ONLY the markdown content.';
      } else {
        prompt =
          'Extract all text from this PDF document as plain text. Do not use any markdown formatting (like #, *, tables, etc). Simply extract the raw text content in a readable format. Return ONLY the text.';
      }
      break;
    case 'EXCEL':
      prompt =
        'Identify the main table or data in this PDF document and convert it into CSV format. Ensure the headers are correct. Return ONLY the CSV data, no other text or markdown code blocks.';
      break;
    case 'PPT':
      prompt =
        "Analyze this PDF and structure it into a presentation outline. Divide the content into 'Slides'. For each slide, provide a Title and Bullet Points of the main content. Use Markdown. Format it as: # Slide 1: [Title]\n* [Point 1]\n* [Point 2]";
      break;
    case 'OCR':
      prompt =
        'This is a scanned document in PDF format. Perform OCR to extract all readable text. Preserve the original layout and line breaks as much as possible. Return the extracted text.';
      break;
    case 'BANK_STATEMENT':
      prompt =
        'Extract all transaction data from this bank statement PDF. Convert it to CSV format with columns for: Date, Description, Debit, Credit, Balance. Ensure proper formatting and handle different transaction types. Return ONLY the CSV data with headers, no other text or markdown code blocks.';
      break;
  }

  // Enhance prompt if advanced mode is on
  if (advanced) {
    prompt = `[ADVANCED MODE: DEEP EXTRACTION]\n${prompt}\nPerform an exhaustive analysis of the document. Ensure no small details, footer text, or complex table data is missed. Focus on structural integrity and perfect formatting.`;
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64,
          },
        },
        { text: prompt },
      ],
    },
  });

  // Clean up code blocks if Gemini returns them (common for CSV)
  let text = response.text || '';
  if (mode === 'EXCEL') {
    text = text
      .replace(/```csv/g, '')
      .replace(/```/g, '')
      .trim();
  }
  return text;
};

export const generateSpeech = async (text: string) => {
  if (!ai) {
    return null; // Return null for demo mode - text-to-speech requires API key
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
};

export const createChatSession = (systemInstruction: string) => {
  if (!ai) {
    return null; // Return null for demo mode
  }
  return ai.chats.create({
    model: MODEL_NAME,
    config: { systemInstruction },
  });
};
