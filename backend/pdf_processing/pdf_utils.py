"""
PDF processing module using PyMuPDF (fitz) for efficient document operations.
"""
import fitz  # PyMuPDF
from typing import List, IO
import io

def merge_pdfs(pdf_files: List[bytes]) -> bytes:
    """
    Merge multiple PDF files into a single PDF using PyMuPDF.
    """
    result_pdf = fitz.open()
    for pdf_bytes in pdf_files:
        pdf_stream = io.BytesIO(pdf_bytes)
        pdf = fitz.open(stream=pdf_stream, filetype="pdf")
        result_pdf.insert_pdf(pdf)
        pdf.close()
    
    output_bytes = result_pdf.tobytes(garbage=4, deflate=True, clean=True)
    result_pdf.close()
    return output_bytes

def split_pdf(pdf_bytes: bytes, split_points: List[int]) -> List[bytes]:
    """
    Split a PDF at specified page indices using PyMuPDF.
    `split_points` are the page numbers *before* which to split.
    """
    pdf_stream = io.BytesIO(pdf_bytes)
    input_pdf = fitz.open(stream=pdf_stream, filetype="pdf")
    
    result_parts = []
    start = 0
    
    # Add the final page to ensure the last part is created
    split_at = sorted(list(set(split_points + [len(input_pdf)])))

    for point in split_at:
        if point > start and point <= len(input_pdf):
            output_pdf = fitz.open()
            output_pdf.insert_pdf(input_pdf, from_page=start, to_page=point - 1)
            result_parts.append(output_pdf.tobytes(garbage=4, deflate=True, clean=True))
            output_pdf.close()
            start = point
            
    input_pdf.close()
    return result_parts

def compress_pdf(pdf_bytes: bytes) -> bytes:
    """
    Compress a PDF file using PyMuPDF's save options.
    """
    pdf_stream = io.BytesIO(pdf_bytes)
    pdf = fitz.open(stream=pdf_stream, filetype="pdf")
    
    # The `garbage`, `deflate`, and `clean` options help in compressing the PDF.
    output_bytes = pdf.tobytes(garbage=4, deflate=True, clean=True)
    pdf.close()
    
    return output_bytes

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text from PDF using PyMuPDF for better accuracy.
    """
    pdf_stream = io.BytesIO(pdf_bytes)
    pdf = fitz.open(stream=pdf_stream, filetype="pdf")
    
    text = ""
    for page in pdf:
        text += page.get_text() + "\n"
        
    pdf.close()
    return text