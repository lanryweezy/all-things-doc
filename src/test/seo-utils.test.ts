import { describe, it, expect } from 'vitest';
import { generateSEOSlug, generateMetaKeywords } from '../seo-utils';
import { ToolID } from '../types';

describe('SEO Utils', () => {
  describe('generateSEOSlug', () => {
    it('should convert title to lowercase', () => {
      expect(generateSEOSlug('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSEOSlug('pdf to word')).toBe('pdf-to-word');
    });

    it('should remove special characters', () => {
      expect(generateSEOSlug('PDF to Word! @#$')).toBe('pdf-to-word');
    });

    it('should collapse multiple hyphens', () => {
      expect(generateSEOSlug('pdf---to---word')).toBe('pdf-to-word');
    });

    it('should collapse multiple spaces', () => {
      expect(generateSEOSlug('pdf   to   word')).toBe('pdf-to-word');
    });

    it('should handle leading and trailing hyphens', () => {
      // This is expected to fail with the current implementation using .trim("-")
      expect(generateSEOSlug('-pdf-to-word-')).toBe('pdf-to-word');
    });

    it('should handle leading and trailing spaces', () => {
      expect(generateSEOSlug(' pdf to word ')).toBe('pdf-to-word');
    });

    it('should return empty string for empty input', () => {
      expect(generateSEOSlug('')).toBe('');
    });
  });

  describe('generateMetaKeywords', () => {
    it('should return default keywords when no toolId is provided', () => {
      const keywords = generateMetaKeywords();
      expect(keywords).toContain('free online tools');
      expect(keywords).toContain('all things doc');
    });

    it('should include tool title in keywords', () => {
      const keywords = generateMetaKeywords(ToolID.JWT_SECRET_GENERATOR);
      expect(keywords).toContain('jwt');
      expect(keywords).toContain('secret');
    });

    it('should include additional keywords', () => {
      const keywords = generateMetaKeywords(ToolID.JWT_SECRET_GENERATOR, ['custom-keyword']);
      expect(keywords).toContain('custom-keyword');
    });

    it('should deduplicate keywords', () => {
      const keywords = generateMetaKeywords(ToolID.JWT_SECRET_GENERATOR, ['jwt', 'secret']);
      const jwtOccurrences = keywords.filter(k => k === 'jwt').length;
      expect(jwtOccurrences).toBe(1);
    });
  });
});
