'use server';

/**
 * @fileOverview An AI flow that generates Playwright E2E test code by analyzing a webpage's HTML.
 */

import { callOpenRouterWithJson } from '@/lib/openrouter';
import { z } from 'zod';
import { chromium } from 'playwright';

const GenerateE2eTestInputSchema = z.object({
  url: z.string().url().describe('The URL of the page to test.'),
  task: z.string().describe('The high-level task to accomplish in the test.'),
});
export type GenerateE2eTestInput = z.infer<typeof GenerateE2eTestInputSchema>;

const GenerateE2eTestOutputSchema = z.object({
  playwrightCode: z.string().describe('The complete, runnable Playwright test code as a string.'),
});
export type GenerateE2eTestOutput = z.infer<typeof GenerateE2eTestOutputSchema>;

// Helper function to fetch HTML content of a URL using Playwright
async function getPageHtml(url: string): Promise<string> {
  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' }); // Wait for the main HTML to be loaded
    const html = await page.content();
    await browser.close();
    return html;
  } catch (error) {
    console.error('Error fetching page HTML with Playwright:', error);
    if (browser) {
      await browser.close();
    }
    throw new Error('Could not retrieve the HTML content from the provided URL. Please ensure it is a publicly accessible page.');
  }
}


export async function generateE2eTest(input: GenerateE2eTestInput): Promise<GenerateE2eTestOutput> {
  const pageHtml = await getPageHtml(input.url);

  const prompt = `
    You are an expert QA Automation Engineer who specializes in writing Playwright tests.
    Your task is to generate a complete, runnable Playwright test script based on a user's request and the HTML of a webpage.

    **User's Goal:**
    ${input.task}

    **Target URL:**
    ${input.url}

    **Webpage HTML:**
    \`\`\`html
    ${pageHtml}
    \`\`\`

    **Instructions:**
    1.  Analyze the provided HTML to understand the structure of the page, including forms, buttons, links, and input fields.
    2.  Write a complete Playwright test script in TypeScript that accomplishes the user's goal.
    3.  The script should be self-contained in a single \`test()\` block.
    4.  Use Playwright's best practices, such as using locators (e.g., \`page.getByRole()\`, \`page.getByLabel()\`) instead of brittle selectors like XPath or auto-generated IDs.
    5.  Include necessary imports from \`@playwright/test\`.
    6.  The test should navigate to the specified URL at the beginning.
    7.  Add comments to explain the key steps in the test.
    8.  Return ONLY the generated code as a string. Do not include any other text, explanations, or markdown formatting.

    Return the output as a JSON object that strictly follows this Zod schema:
    ${JSON.stringify(GenerateE2eTestOutputSchema.shape)}
    `;

  return callOpenRouterWithJson<GenerateE2eTestOutput>({
    model: 'google/gemini-flash-1.5',
    messages: [{ role: 'user', content: prompt }],
  });
}
