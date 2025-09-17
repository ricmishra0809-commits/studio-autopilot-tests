'use server';

/**
 * @fileOverview An AI agent for generating automated test scripts for Firebase projects.
 *
 * - generateAutomatedTests - A function that generates test scripts based on project details.
 * - GenerateAutomatedTestsInput - The input type for the generateAutomatedTests function.
 * - GenerateAutomatedTestsOutput - The return type for the generateAutomatedTests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAutomatedTestsInputSchema = z.object({
  backend: z.string().describe('Description of the backend: Firebase Auth, Firestore, Firebase Functions, Hosting'),
  tools: z.string().describe('List of tools being used: Firebase Emulator, Playwright (E2E), Jest (Unit tests), Supertest (API), n8n workflows, GitHub Actions (backup)'),
  firestoreSchema: z.string().describe('The Firestore schema definition.'),
  functionsCode: z.string().describe('The Firebase Functions code.'),
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
  return generateAutomatedTestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutomatedTestsPrompt',
  input: {schema: GenerateAutomatedTestsInputSchema},
  output: {schema: GenerateAutomatedTestsOutputSchema},
  prompt: `You are an expert QA Automation Engineer specializing in generating automated test scripts for Firebase projects.

  Based on the provided Firebase project details, generate comprehensive test scripts for various aspects of the project.
  Ensure the generated tests cover Jest unit tests for Firebase Functions, Firestore Security Rules tests, Playwright E2E tests for Auth flows (signup/login), and API tests for Cloud Function endpoints.

  Here are the details of the Firebase project:
  Backend: {{{backend}}}
  Tools: {{{tools}}}
  Firestore Schema: {{{firestoreSchema}}}
  Functions Code: {{{functionsCode}}}

  Consider the best practices for each testing framework and provide well-structured and maintainable test scripts.

  Output the test scripts in a JSON format with the following structure:
  {
    "jestUnitTests": "...",
    "firestoreSecurityRulesTests": "...",
    "playwrightE2ETests": "...",
    "apiTests": "..."
  }`,
});

const generateAutomatedTestsFlow = ai.defineFlow(
  {
    name: 'generateAutomatedTestsFlow',
    inputSchema: GenerateAutomatedTestsInputSchema,
    outputSchema: GenerateAutomatedTestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
