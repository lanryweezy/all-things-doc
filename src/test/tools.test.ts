import { describe, it, expect } from 'vitest';
import { TOOLS } from '../constants';
import { ToolID } from '../types';
import { processPdf } from '../services/geminiService';

describe('Tool Registry', () => {
  it('should have File Hasher registered', () => {
    expect(TOOLS[ToolID.FILE_HASHER]).toBeDefined();
    expect(TOOLS[ToolID.FILE_HASHER].title).toBe('File Checksum (Hash)');
  });

  it('should have JWT Decoder registered', () => {
    expect(TOOLS[ToolID.JWT_DECODER]).toBeDefined();
    expect(TOOLS[ToolID.JWT_DECODER].title).toBe('JWT Decoder');
  });
});

describe('Gemini Service', () => {
  it('should export processPdf function', () => {
    expect(processPdf).toBeDefined();
    expect(typeof processPdf).toBe('function');
  });
});
