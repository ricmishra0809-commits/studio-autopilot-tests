import { test, expect } from '@playwright/test';

test('flipkart search for iPhone', async ({ page }) => {
  // Flipkart open karo
  await page.goto('https://www.flipkart.com/');

  // Kabhi kabhi login popup aata hai, close kar do
  const closeBtn = page.locator('button._2KpZ6l._2doB4z');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }

  // Search box me "iPhone" type karo
  await page.fill('input[name="q"]', 'iPhone');

  // Enter press karke search karo
  await page.press('input[name="q"]', 'Enter');

  // Results load hone ka wait karo
  await page.waitForSelector('div._1YokD2._3Mn1Gg');

  // Pehle result element visible hai ya nahi check karo
  const results = page.locator('div._1AtVbE');
  await expect(results.first()).toBeVisible();
});
