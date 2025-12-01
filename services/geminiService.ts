import { GoogleGenAI } from "@google/genai";

// Check if API key is available
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Gemini API key not found in environment variables");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const MODEL_NAME = 'gemini-2.5-flash';

// Helper function to check if AI service is available
const isAiAvailable = (): boolean => {
  return ai !== null;
};

export const summarizeText = async (text: string): Promise<string> => {
  if (!text) return "";
  if (!isAiAvailable()) return "AI service not available. Please check API configuration.";
  
  try {
    const response = await ai!.models.generateContent({
      model: MODEL_NAME,
      contents: `Please summarize the following text concisely, highlighting the key points:\n\n${text}`,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Error in summarizeText:", error);
    return "Failed to generate summary. Please try again later.";
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text) return "";
  if (!isAiAvailable()) return "AI service not available. Please check API configuration.";
  
  try {
    const response = await ai!.models.generateContent({
      model: MODEL_NAME,
      contents: `Translate the following text into ${targetLanguage}. Only provide the translated text, no preamble:\n\n${text}`,
    });
    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Error in translateText:", error);
    return "Failed to translate text. Please try again later.";
  }
};

export const correctGrammar = async (text: string): Promise<string> => {
  if (!text) return "";
  if (!isAiAvailable()) return "AI service not available. Please check API configuration.";
  
  try {
    const response = await ai!.models.generateContent({
      model: MODEL_NAME,
      contents: `Correct the grammar and spelling of the following text. Improve clarity where necessary but maintain the original meaning. Only provide the corrected text:\n\n${text}`,
    });
    return response.text || "Correction failed.";
  } catch (error) {
    console.error("Error in correctGrammar:", error);
    return "Failed to correct grammar. Please try again later.";
  }
};

export const convertCode = async (code: string, targetLang: string): Promise<string> => {
  if (!code) return "";
  if (!isAiAvailable()) return "AI service not available. Please check API configuration.";
  
  try {
    const response = await ai!.models.generateContent({
      model: MODEL_NAME,
      contents: `Convert the following code to ${targetLang}. Provide only the code block, no explanations:\n\n${code}`,
    });
    return response.text || "Code conversion failed.";
  } catch (error) {
    console.error("Error in convertCode:", error);
    return "Failed to convert code. Please try again later.";
  }
};

export const performOCR = async (imageBase64: string, mimeType: string): Promise<string> => {
  if (!isAiAvailable()) return "AI service not available. Please check API configuration.";
  
  try {
    const response = await ai!.models.generateContent({
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
  } catch (error) {
    console.error("Error in performOCR:", error);
    return "Failed to perform OCR. Please try again later.";
  }
};

export const processPdf = async (
  pdfBase64: string, 
  mode: 'WORD' | 'EXCEL' | 'PPT' | 'OCR',
  outputFormat: 'markdown' | 'text' = 'markdown'
): Promise<string> => {
  if (!isAiAvailable()) return "AI service not available. Please check API configuration.";
  
  try {
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

    const response = await ai!.models.generateContent({
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
  } catch (error) {
    console.error("Error in processPdf:", error);
    return "Failed to process PDF. Please try again later.";
  }
};