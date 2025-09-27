import { test, expect } from '@playwright/test';

test.setTimeout(60000); // 60s timeout for the whole test

test('flipkart search for iPhone', async ({ page }) => {
  // Open Flipkart and wait until network is quiet
  await page.goto('https://www.flipkart.com', { waitUntil: 'networkidle' });

  // Close login popup if present
  try {
    const closeBtn = page.locator('button._2KpZ6l._2doB4z');
    if (await closeBtn.isVisible({ timeout: 3000 })) await closeBtn.click();
  } catch (e) {
    // continue if popup not present
  }

  // Fill search box and press Enter
  await page.fill('input[name="q"]', 'iPhone');
  await page.keyboard.press('Enter');

  // Wait for results — using data-id which is more stable than CSS utility classes
  await page.waitForSelector('div[data-id]', { timeout: 45000 });

  // Get first result text and assert it mentions iPhone
  const firstResult = await page.locator('div[data-id]').first().innerText();
  console.log('First result:', firstResult);
  expect(firstResult).toContain('iPhone');
});
