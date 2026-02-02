# All Things Doc - Backend Processing Engine

This repository contains the backend processing engine for All Things Doc, a document processing application. The backend is built with Python and FastAPI to provide efficient document processing capabilities using open-source libraries.

## Features

- **PDF Processing**: Merge, split, compress, and extract text from PDFs
- **AI Processing**: Text summarization, translation, and classification
- **OCR**: Optical Character Recognition for images and PDFs
- **Cost Effective**: Uses open-source libraries to minimize operational costs
- **Scalable**: Built with FastAPI for high performance and easy scaling

## Technologies Used

- Python 3.11
- FastAPI
- PyPDF2
- pdfplumber
- PyMuPDF
- Tesseract OCR
- Transformers (Hugging Face - for advanced deployments)
- Docker

## Setup and Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd all-things-doc/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install Tesseract OCR (for OCR functionality):
   - **Ubuntu/Debian**: `sudo apt-get install tesseract-ocr`
   - **macOS**: `brew install tesseract`
   - **Windows**: Download from [the official site](https://github.com/UB-Mannheim/tesseract/wiki)

5. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Environment Variables

The application can be configured with the following environment variables:

- `VITE_BACKEND_URL`: URL of the backend service (for frontend)

## API Endpoints

### PDF Processing
- `POST /pdf/merge` - Merge multiple PDF files
- `POST /pdf/split` - Split a PDF at specified page indices
- `POST /pdf/compress` - Compress a PDF file
- `POST /pdf/extract-text` - Extract text from a PDF

### AI Processing
- `POST /ai/summarize` - Summarize text content
- `POST /ai/translate` - Translate text to a specified language
- `POST /ai/ocr/image` - Perform OCR on an image
- `POST /ai/ocr/pdf` - Perform OCR on a PDF

### Health Check
- `GET /health` - Check the health status of the service

## Docker Deployment

Build and run with Docker:

```bash
docker build -t all-things-doc-backend .
docker run -p 8000:8000 all-things-doc-backend
```

## Vercel Deployment

The application is configured for Vercel deployment with the following `vercel.json`:

```json
{
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/pdf/(.*)",
      "dest": "main.py"
    },
    {
      "src": "/ai/(.*)",
      "dest": "main.py"
    },
    {
      "src": "/health",
      "dest": "main.py"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Architecture

The backend follows a modular architecture:

- `main.py`: FastAPI application entry point
- `api.py`: API router with all endpoints
- `pdf_processing/`: PDF processing utilities
- `ai_processing/`: AI and text processing utilities

## Cost Optimization

This backend significantly reduces operational costs by:

1. Using open-source libraries instead of expensive cloud APIs
2. Processing documents server-side for better performance
3. Providing fallback options to cloud APIs when needed
4. Optimizing resource usage through FastAPI's async nature

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.