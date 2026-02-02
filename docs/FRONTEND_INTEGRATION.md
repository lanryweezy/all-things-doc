# Frontend Integration Guide

This document explains how the frontend of All Things Doc integrates with the new Python backend for enhanced document processing capabilities.

## Architecture Overview

The application now utilizes a hybrid approach:
- **Backend Processing**: For heavy computational tasks, cost-sensitive operations, and improved performance
- **Gemini API**: For advanced AI tasks when backend is not available or for capabilities not implemented in the backend
- **Client-side Processing**: For simple operations that don't require server resources

## Service Integration

### 1. Backend Service (`backendService.ts`)

This service handles all communication with the Python backend:

```typescript
// Example usage
import { mergePdfs, summarizeText } from './services/backendService';

// Merge PDFs
const mergedPdf = await mergePdfs([file1, file2]);

// Summarize text
const summary = await summarizeText("Your long text here");
```

### 2. Updated Gemini Service (`geminiService.ts`)

The geminiService now intelligently routes requests:

- If `VITE_BACKEND_URL` is configured, it attempts to use the backend first
- Falls back to Gemini API if backend is unavailable
- Provides demo mode if neither is available

## Configuration

### Environment Variables

To enable backend processing, set the following environment variable:

```bash
VITE_BACKEND_URL="https://your-deployment.vercel.app"
```

Or for local development:
```bash
VITE_BACKEND_URL="http://localhost:8000"
```

### Conditional Processing

The frontend now uses conditional processing based on availability:

```typescript
const BACKEND_AVAILABLE = !!import.meta.env.VITE_BACKEND_URL;
const GEMINI_AVAILABLE = !!ai;  // From existing setup

if (BACKEND_AVAILABLE) {
  // Use backend for supported operations
} else if (GEMINI_AVAILABLE) {
  // Use Gemini API
} else {
  // Demo mode
}
```

## API Endpoints Used

The frontend communicates with these backend endpoints:

### PDF Processing
- `POST /pdf/merge` - Merge PDF files
- `POST /pdf/split` - Split PDF files
- `POST /pdf/compress` - Compress PDF files
- `POST /pdf/extract-text` - Extract text from PDF

### AI Processing
- `POST /ai/summarize` - Text summarization
- `POST /ai/translate` - Text translation
- `POST /ai/ocr/image` - OCR for images
- `POST /ai/ocr/pdf` - OCR for PDFs

## Error Handling

The system implements robust error handling:

```typescript
try {
  const result = await backendFunction();
} catch (error) {
  console.warn('Backend operation failed, falling back:', error);
  // Fallback to alternative processing method
}
```

## Performance Benefits

1. **Reduced API Costs**: Backend processing uses open-source libraries instead of paid APIs
2. **Improved Performance**: Server-side processing for complex operations
3. **Better Scalability**: More efficient resource utilization
4. **Enhanced Reliability**: Multiple fallback options

## Deployment Notes

### Vercel Configuration

The `vercel.json` file routes backend requests appropriately:

```json
{
  "routes": [
    {
      "src": "/pdf/(.*)",
      "dest": "/backend/main.py"
    },
    {
      "src": "/ai/(.*)",
      "dest": "/backend/main.py"
    }
  ]
}
```

This ensures that `/pdf/*` and `/ai/*` requests are handled by the Python backend while maintaining the same domain as the frontend.

## Migration Path

The integration is designed to be non-disruptive:
1. Existing functionality remains unchanged
2. Backend processing is enabled when `VITE_BACKEND_URL` is set
3. Automatic fallbacks ensure continuous operation
4. No changes required to UI components

## Future Enhancements

The architecture allows for easy extension:
- Add new processing endpoints in `api.py`
- Update `backendService.ts` with new functions
- The system will automatically use new capabilities when available