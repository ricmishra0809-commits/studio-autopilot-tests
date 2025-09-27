'use server';

/**
 * @fileOverview An AI agent for generating automated test scripts for Firebase projects.
 */

import { callOpenRouterWithJson } from '@/lib/openrouter';
import { z } from 'zod';

const GenerateAutomatedTestsInputSchema = z.object({
  projectDetails: z.string().describe('The full details of the project, including backend services, tools, schema, and function code. This can be a single block of text or a structured document.'),
});
export type GenerateAutomatedTestsInput = z.infer<typeof GenerateAutomatedTestsInputSchema>;

const GenerateAutomatedTestsOutputSchema = z.object({
  jestUnitTests: z.string().describe('Generated Jest unit tests for Firebase Functions.'),
  firestoreSecurityRulesTests: z.string().describe('Generated Firestore Security Rules tests.'),
  playwrightE2ETests: z.string().describe('Generated Playwright E2E tests for Auth flows (signup/login).'),
  apiTests: z.string().describe('Generated API tests for Cloud Function endpoints.'),
});
export type GenerateAutomatedTestsOutput = z.infer<typeof GenerateAutomatedTestsOutputSchema>;

export async function generateAutomatedTests(input: GenerateAutomatedTestsInput): Promise<GenerateAutomatedTestsOutput> {
  const prompt = `You are an expert QA Automation Engineer specializing in generating automated test scripts for Firebase projects.

  Based on the provided Firebase project details below, analyze the information and generate comprehensive test scripts.
  The details might be unstructured. Your first task is to identify the backend services (like Firebase Auth, Firestore), the tools being used (like Playwright, Jest), the Firestore schema, and any relevant Firebase Functions code.

  Once you have parsed this information, generate the following test scripts:
  1.  Jest unit tests for any Firebase Functions you find.
  2.  Firestore Security Rules tests based on the schema and rules.
  3.  Playwright E2E tests for user authentication flows (signup/login).
  4.  API tests for any Cloud Function HTTP endpoints.

  Here are the project details:
  ${input.projectDetails}

  Consider the best practices for each testing framework and provide well-structured and maintainable test scripts.
  Return the output as a JSON object that strictly follows this Zod schema:
  ${JSON.stringify(GenerateAutomatedTestsOutputSchema.shape)}
  `;

  return callOpenRouterWithJson<GenerateAutomatedTestsOutput>({
    model: 'xai/grok-4-fast',
    messages: [{ role: 'user', content: prompt }],
  });
}
