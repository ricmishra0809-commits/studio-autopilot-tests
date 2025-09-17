'use server';

/**
 * @fileOverview AI-powered test strategy generator for Firebase projects.
 *
 * - generateTestStrategy - A function that generates a comprehensive test strategy document.
 * - GenerateTestStrategyInput - The input type for the generateTestStrategy function.
 * - GenerateTestStrategyOutput - The return type for the generateTestStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestStrategyInputSchema = z.object({
  backendDetails: z
    .string()
    .describe(
      'Details about the backend: Firebase Auth, Firestore, Firebase Functions, Hosting.'
    ),
  tools: z
    .string()
    .describe(
      'Tools used in the project: Firebase Emulator, Playwright (E2E), Jest (Unit tests), Supertest (API), n8n workflows, GitHub Actions.'
    ),
  goal: z
    .string()
    .describe(
      'The goal of the testing strategy: On every code push -> run automated tests -> summarize results with AI -> notify team -> auto-deploy if tests pass.'
    ),
});

export type GenerateTestStrategyInput = z.infer<typeof GenerateTestStrategyInputSchema>;

const GenerateTestStrategyOutputSchema = z.object({
  testStrategyDocument: z
    .string()
    .describe('A comprehensive test strategy document for the Firebase project.'),
});

export type GenerateTestStrategyOutput = z.infer<typeof GenerateTestStrategyOutputSchema>;

export async function generateTestStrategy(input: GenerateTestStrategyInput): Promise<GenerateTestStrategyOutput> {
  return generateTestStrategyFlow(input);
}

const generateTestStrategyPrompt = ai.definePrompt({
  name: 'generateTestStrategyPrompt',
  input: {schema: GenerateTestStrategyInputSchema},
  output: {schema: GenerateTestStrategyOutputSchema},
  prompt: `You are an expert QA Automation Engineer, Firebase Specialist, and No-Code Workflow Architect.
  Your task is to create a complete AI-powered software testing automation system for a Firebase Studio project.

  Based on the following project details, generate a comprehensive test strategy document:

  Project Details:
  - Backend: {{{backendDetails}}}
  - Tools: {{{tools}}}
  - Goal: {{{goal}}}

  The test strategy document should cover the following:
  - Define unit, integration, E2E, API, and security rules tests for Firebase.
  - Explain coverage goals.
  - Mention frameworks and emulator usage.
`,
});

const generateTestStrategyFlow = ai.defineFlow(
  {
    name: 'generateTestStrategyFlow',
    inputSchema: GenerateTestStrategyInputSchema,
    outputSchema: GenerateTestStrategyOutputSchema,
  },
  async input => {
    const {output} = await generateTestStrategyPrompt(input);
    return output!;
  }
);
