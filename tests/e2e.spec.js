const { test, expect } = require('@playwright/test');

test.describe('E2E Browser Tests', () => {

  test('Homepage displays the welcome message', async ({ page }) => {
    // Navigate to the root URL (configured as http://localhost:3000 in playwright.config.js)
    await page.goto('/');

    // Since the root returns a raw JSON response, we verify the body text contains our string.
    const bodyText = await page.textContent('body');
    
    expect(bodyText).toContain('Hello from CI/CD Practice App! 🚀');
    expect(bodyText).toContain('1.0');
    expect(bodyText).toContain('timestamp');
  });

  test('Health endpoint operates correctly via API Request', async ({ request }) => {
    // Playwright isn't just for scraping! It can do API requests perfectly too.
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('Math API calculates successfully via API Request', async ({ request }) => {
    const response = await request.get('/add/15/27');
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body.result).toBe(42);
  });

});
