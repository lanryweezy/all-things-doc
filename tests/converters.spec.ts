import { test, expect } from '@playwright/test';

test.describe('Document Converter Integration Tests', () => {
  test('Dashboard loads and search works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Every tool you need');

    // Search for a tool
    const searchInput = page.locator('input[placeholder*="Search for tools"]');
    await searchInput.fill('Checksum');
    await expect(page.locator('h3')).toContainText('File Checksum');
  });

  test('File Hasher tool navigation and UI', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[placeholder*="Search for tools"]').fill('Checksum');
    await page.click('text=File Checksum');

    await expect(page.locator('h1')).toContainText('File Checksum');
    await expect(page.locator('text=Upload File to Generate Checksums')).toBeVisible();
  });

  test('JWT Decoder tool navigation and validation', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[placeholder*="Search for tools"]').fill('JWT Decoder');
    await page.click('text=JWT Decoder');

    await expect(page.locator('h1')).toContainText('JWT Decoder');
    const textarea = page.locator('textarea[placeholder*="Paste your JWT"]');
    await textarea.fill('invalid.token.here');
    await expect(page.locator('text=Invalid Token')).toBeVisible();
  });

  test('Unit Converter functionality', async ({ page }) => {
    await page.goto('/tools/unit-converter');
    await expect(page.locator('h1')).toContainText('Unit Converter');

    // Test a simple conversion
    const input = page.locator('input[type="number"]').first();
    await input.fill('1');
    // Result should update
    const result = page.locator('input[type="number"]').last();
    const value = await result.inputValue();
    expect(parseFloat(value)).toBeGreaterThan(0);
  });
});
