import { describe, it, expect } from 'vitest';

// Fix relative paths - src/test/tools.test.ts to src/constants.ts is just ../constants
import { TOOLS } from '../constants';
import { ToolID } from '../types';

describe('Tool Registry', () => {
  it('should have File Hasher registered', () => {
    expect(TOOLS[ToolID.FILE_HASHER]).toBeDefined();
    expect(TOOLS[ToolID.FILE_HASHER].title).toBe('File Checksum');
  });

  it('should have JWT Decoder registered', () => {
    expect(TOOLS[ToolID.JWT_DECODER]).toBeDefined();
    expect(TOOLS[ToolID.JWT_DECODER].title).toBe('JWT Decoder');
  });
});

import { processPdf } from '../services/geminiService';

describe('Gemini Service', () => {
  it('should export processPdf function', () => {
    expect(processPdf).toBeDefined();
    expect(typeof processPdf).toBe('function');
  });
});
