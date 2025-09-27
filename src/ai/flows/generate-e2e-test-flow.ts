'use server';

/**
 * @fileOverview An AI agent for generating E2E test scripts by analyzing page HTML.
 */

import { callOpenRouterWithJson } from '@/lib/openrouter';
import { z } from 'zod';

const GenerateE2eTestInputSchema = z.object({
  url: z.string().url().describe('The URL of the web page to test.'),
  task: z.string().describe('The high-level task to perform on the page.'),
});
export type GenerateE2eTestInput = z.infer<typeof GenerateE2eTestInputSchema>;

const GenerateE2eTestOutputSchema = z.object({
  playwrightCode: z.string().describe('The generated Playwright test code.'),
});
export type GenerateE2eTestOutput = z.infer<typeof GenerateE2eTestOutputSchema>;

async function fetchPageHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error: any) {
    console.error(`Failed to fetch HTML from ${url}:`, error);
    throw new Error(`Could not fetch page content from ${url}. Please ensure it's a valid, publicly accessible URL.`);
  }
}

export async function generateE2eTest(
  input: GenerateE2eTestInput
): Promise<GenerateE2eTestOutput> {
  const { url, task } = input;

  const htmlContent = await fetchPageHtml(url);

  // Clean up HTML to reduce token count
  const bodyContentMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyContentMatch ? bodyContentMatch[1] : htmlContent;
  const strippedHtml = bodyContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();


  const prompt = `
    You are an expert QA Automation Engineer specializing in writing Playwright tests with TypeScript.
    Your task is to generate a Playwright test script based on a user's task and the HTML of a web page.

    **Instructions:**
    1.  Analyze the provided HTML to understand the structure of the page, including forms, buttons, links, and other interactive elements.
    2.  Write a complete Playwright test script that accomplishes the user's task.
    3.  Use the best locator strategies (e.g., \`getByRole\`, \`getByText\`, \`getByLabel\`) for robust tests. Avoid using brittle selectors like class names or complex CSS paths if possible.
    4.  Add assertions (\`expect\`) to verify the outcome of actions. For example, after a form submission, expect a success message to be visible.
    5.  Wrap the code in a standard Playwright \`test()\` block.

    **User Task:**
    "${task}"

    **Page URL:**
    ${url}

    **Page HTML (body only, stripped of scripts and styles):**
    \`\`\`html
    ${strippedHtml}
    \`\`\`

    Generate the complete Playwright code.
    `;

    const response = await callOpenRouterWithJson<{ playwrightCode: string }>({
        model: 'google/gemini-flash-1.5',
        messages: [{ role: 'user', content: prompt }],
    });

  return response;
}
