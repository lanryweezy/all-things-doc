import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mergePdfs } from '../services/backendService';

describe('backendService', () => {
  const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('mergePdfs', () => {
    it('successfully merges PDFs', async () => {
      const mockBlob = new Blob(['merged pdf content'], { type: 'application/pdf' });
      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const result = await mergePdfs([mockFile]);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/pdf/merge'), expect.any(Object));
      expect(result).toBe(mockBlob);
    });

    it('throws error with API detail when response is not ok', async () => {
      const errorMessage = 'Custom API Error';
      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ detail: errorMessage }),
      });

      await expect(mergePdfs([mockFile])).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error merging PDFs:', expect.any(Error));
    });

    it('throws default error message when response is not ok and no detail is provided', async () => {
      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(mergePdfs([mockFile])).rejects.toThrow('Failed to merge PDFs');
      expect(console.error).toHaveBeenCalledWith('Error merging PDFs:', expect.any(Error));
    });

    it('rethrows network errors and logs them', async () => {
      const networkError = new Error('Network failure');
      (vi.mocked(fetch) as any).mockRejectedValueOnce(networkError);

      await expect(mergePdfs([mockFile])).rejects.toThrow('Network failure');
      expect(console.error).toHaveBeenCalledWith('Error merging PDFs:', networkError);
    });
  });
});
