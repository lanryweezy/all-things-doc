"""
AI processing module using Google's Generative AI
"""
import os
import google.generativeai as genai
from typing import List
import pytesseract
from PIL import Image
import io

# Configure the generative AI model
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    text_generation_model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"Error configuring Generative AI: {e}")
    text_generation_model = None

class TextProcessor:
    def __init__(self):
        """Initialize text processing with Generative AI"""
        self.model = text_generation_model

    def summarize_text(self, text: str, max_length: int = 150) -> str:
        """Summarize text using the Gemini model"""
        if not self.model:
            return "Error: Generative AI model not configured."
        
        prompt = f"Summarize the following text in about {max_length} words:\n\n{text}"
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Summarization error: {str(e)}"

    def translate_text(self, text: str, target_language: str = "es") -> str:
        """Translate text using the Gemini model"""
        if not self.model:
            return "Error: Generative AI model not configured."
            
        prompt = f"Translate the following text to {target_language}:\n\n{text}"
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Translation error: {str(e)}"

    def classify_text(self, text: str, candidate_labels: List[str]) -> dict:
        """Classify text using the Gemini model with a zero-shot approach"""
        if not self.model:
            return {"error": "Generative AI model not configured."}

        prompt = f"""
        Classify the following text into one of these categories: {', '.join(candidate_labels)}.
        Return only the category name.

        Text: "{text}"
        Category:"""
        try:
            response = self.model.generate_content(prompt)
            # Simple parsing, assuming the model returns just the label.
            label = response.text.strip()
            if label in candidate_labels:
                scores = [1.0 if l == label else 0.0 for l in candidate_labels]
                return {"labels": candidate_labels, "scores": scores}
            return {"labels": [], "scores": [], "detail": f"Model returned an unexpected label: {label}"}
        except Exception as e:
            return {"error": f"Classification error: {str(e)}"}


def ocr_image(image_bytes: bytes, language: str = "eng") -> str:
    """Perform OCR on an image using Tesseract"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image, lang=language)
        return text.strip()
    except Exception as e:
        return f"OCR error: {str(e)}"


def ocr_pdf(pdf_bytes: bytes, language: str = "eng") -> str:
    """Perform OCR on a PDF by extracting each page as an image first"""
    import fitz  # PyMuPDF

    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = ""

        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            # Get page as image
            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better OCR quality
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes("png")

            image = Image.open(io.BytesIO(img_data))
            text = pytesseract.image_to_string(image, lang=language)
            full_text += text + "\n\n"

        pdf_document.close()
        return full_text.strip()
    except Exception as e:
        return f"PDF OCR error: {str(e)}"