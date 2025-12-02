import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const summarizeText = async (text: string): Promise<string> => {
  if (!text) return "";
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Please summarize the following text concisely, highlighting the key points:\n\n${text}`,
  });
  return response.text || "No summary generated.";
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text) return "";
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Translate the following text into ${targetLanguage}. Only provide the translated text, no preamble:\n\n${text}`,
  });
  return response.text || "Translation failed.";
};

export const correctGrammar = async (text: string): Promise<string> => {
  if (!text) return "";
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Correct the grammar and spelling of the following text. Improve clarity where necessary but maintain the original meaning. Only provide the corrected text:\n\n${text}`,
  });
  return response.text || "Correction failed.";
};

export const convertCode = async (code: string, targetLang: string): Promise<string> => {
  if (!code) return "";
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Convert the following code to ${targetLang}. Provide only the code block, no explanations:\n\n${code}`,
  });
  return response.text || "Code conversion failed.";
};

export const performOCR = async (imageBase64: string, mimeType: string): Promise<string> => {
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
          text: "Extract all text visible in this image. Preserve the formatting as much as possible.",
        },
      ],
    },
  });
  return response.text || "No text found in image.";
};

export const processPdf = async (
  pdfBase64: string, 
  mode: 'WORD' | 'EXCEL' | 'PPT' | 'OCR',
  outputFormat: 'markdown' | 'text' = 'markdown'
): Promise<string> => {
  let prompt = "";
  
  switch(mode) {
    case 'WORD':
      if (outputFormat === 'markdown') {
        prompt = "Convert the content of this PDF into structured Markdown. Preserve headings, bullet points, and paragraph structure. Return ONLY the markdown content.";
      } else {
        prompt = "Extract all text from this PDF document as plain text. Do not use any markdown formatting (like #, *, tables, etc). Simply extract the raw text content in a readable format. Return ONLY the text.";
      }
      break;
    case 'EXCEL':
      prompt = "Identify the main table or data in this PDF document and convert it into CSV format. Ensure the headers are correct. Return ONLY the CSV data, no other text or markdown code blocks.";
      break;
    case 'PPT':
      prompt = "Analyze this PDF and structure it into a presentation outline. Divide the content into 'Slides'. For each slide, provide a Title and Bullet Points of the main content. Use Markdown. Format it as: # Slide 1: [Title]\n* [Point 1]\n* [Point 2]";
      break;
    case 'OCR':
      prompt = "This is a scanned document in PDF format. Perform OCR to extract all readable text. Preserve the original layout and line breaks as much as possible. Return the extracted text.";
      break;
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
  let text = response.text || "";
  if (mode === 'EXCEL') {
    text = text.replace(/```csv/g, '').replace(/```/g, '').trim();
  }
  return text;
};

export const generateSpeech = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
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
  return ai.chats.create({
    model: MODEL_NAME,
    config: { systemInstruction }
  });
};