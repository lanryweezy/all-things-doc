from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import StreamingResponse
from typing import List
import io
import zipfile

# Import our processing modules
from pdf_processing.pdf_utils import (
    merge_pdfs, split_pdf, compress_pdf, 
    extract_text_from_pdf
)
from parsing_utils import parse_split_points
from ai_processing.ai_utils import TextProcessor, ocr_image, ocr_pdf

router = APIRouter()
text_processor = TextProcessor()

# PDF Processing Endpoints
@router.post("/pdf/merge")
async def merge_pdfs_endpoint(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files into a single PDF and return it for download."""
    try:
        pdf_bytes_list = [await file.read() for file in files]
        
        merged_pdf = merge_pdfs(pdf_bytes_list)
        
        return StreamingResponse(
            io.BytesIO(merged_pdf),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error merging PDFs: {str(e)}")


@router.post("/pdf/split")
async def split_pdf_endpoint(file: UploadFile = File(...), split_points: str = Form("")):
    """Split a PDF at specified page indices and return a ZIP archive."""
    try:
        content = await file.read()
        
        # Ensure filename is safe to use
        original_filename = file.filename if file.filename else "file"
        base_filename = "".join(x for x in original_filename if x.isalnum() or x in "._-")
        
        split_points_list = parse_split_points(split_points)
        
        split_pdfs = split_pdf(content, split_points_list)
        
        # Create a ZIP file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
            for i, pdf_bytes in enumerate(split_pdfs):
                zf.writestr(f"{base_filename}_part_{i+1}.pdf", pdf_bytes)
        
        zip_buffer.seek(0)
        
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={base_filename}_split.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error splitting PDF: {str(e)}")


@router.post("/pdf/compress")
async def compress_pdf_endpoint(file: UploadFile = File(...)):
    """Compress a PDF file and return it for download."""
    try:
        content = await file.read()
        compressed_pdf = compress_pdf(content)
        
        return StreamingResponse(
            io.BytesIO(compressed_pdf),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=compressed.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error compressing PDF: {str(e)}")


@router.post("/pdf/extract-text")
async def extract_text_pdf_endpoint(file: UploadFile = File(...)):
    """Extract text from a PDF file"""
    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# AI Processing Endpoints
@router.post("/ai/summarize")
async def summarize_text_endpoint(text: str = Form(...)):
    """Summarize text using open-source model"""
    try:
        summary = text_processor.summarize_text(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/ai/translate")
async def translate_text_endpoint(text: str = Form(...), target_language: str = Form("es")):
    """Translate text using open-source model"""
    try:
        translation = text_processor.translate_text(text, target_language)
        return {"translation": translation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/ai/ocr/image")
async def ocr_image_endpoint(file: UploadFile = File(...), language: str = "eng"):
    """Perform OCR on an image"""
    try:
        content = await file.read()
        text = ocr_image(content, language)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/ai/ocr/pdf")
async def ocr_pdf_endpoint(file: UploadFile = File(...), language: str = "eng"):
    """Perform OCR on a PDF"""
    try:
        content = await file.read()
        text = ocr_pdf(content, language)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/ai/classify")
async def classify_text_endpoint(text: str = Form(...), candidate_labels: List[str] = Form(...)):
    """Classify text using the Gemini model with a zero-shot approach"""
    try:
        classification = text_processor.classify_text(text, candidate_labels)
        return classification
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
