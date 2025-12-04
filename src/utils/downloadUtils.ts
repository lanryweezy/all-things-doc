/**
 * Utility functions for handling file downloads with better browser compatibility
 */

/**
 * Download a file with improved browser compatibility
 * @param data - The file data (Blob, Uint8Array, or string)
 * @param filename - The filename for the download
 * @param mimeType - The MIME type of the file
 */
export function downloadFile(
  data: Blob | Uint8Array | string,
  filename: string,
  mimeType: string = 'application/octet-stream'
): void {
  try {
    let blob: Blob;

    if (data instanceof Blob) {
      blob = data;
    } else if (data instanceof Uint8Array) {
      blob = new Blob([data], { type: mimeType });
    } else if (typeof data === 'string') {
      blob = new Blob([data], { type: mimeType });
    } else {
      throw new Error('Unsupported data type for download');
    }

    // Create download URL
    const url = URL.createObjectURL(blob);

    // Create and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    a.target = '_blank'; // Help with some browser security
    a.rel = 'noopener noreferrer'; // Security best practice

    document.body.appendChild(a);

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      try {
        // Try the standard click first
        a.click();

        // Fallback: try dispatching a MouseEvent
        if (!a.download) {
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          a.dispatchEvent(event);
        }
      } catch (clickError) {
        console.warn('Standard click failed, trying fallback method:', clickError);

        // Final fallback: navigate to the URL
        window.open(url, '_blank');
      }

      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    });
  } catch (error) {
    console.error('Download failed:', error);
    alert(
      `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your browser settings.`
    );
  }
}

/**
 * Download text content as a file
 */
export function downloadText(
  text: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  downloadFile(text, filename, mimeType);
}

/**
 * Download binary data as a file
 */
export function downloadBinary(data: Uint8Array, filename: string, mimeType: string): void {
  downloadFile(data, filename, mimeType);
}

/**
 * Download a Blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  downloadFile(blob, filename);
}
