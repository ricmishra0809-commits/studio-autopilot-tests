'use server';

/**
 * @fileOverview AI-powered test strategy generator for Firebase projects.
 */

import { callOpenRouterWithJson } from '@/lib/openrouter';
import { z } from 'genkit';

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
    const prompt = `You are an expert QA Automation Engineer, Firebase Specialist, and No-Code Workflow Architect.
  Your task is to create a complete AI-powered software testing automation system for a Firebase Studio project.

  Based on the following project details, generate a comprehensive test strategy document:

  Project Details:
  - Backend: ${input.backendDetails}
  - Tools: ${input.tools}
  - Goal: ${input.goal}

  The test strategy document should cover the following:
  - Define unit, integration, E2E, API, and security rules tests for Firebase.
  - Explain coverage goals.
  - Mention frameworks and emulator usage.

  Return the output as a JSON object that strictly follows this Zod schema:
  ${JSON.stringify(GenerateTestStrategyOutputSchema.shape)}
`;

    return callOpenRouterWithJson<GenerateTestStrategyOutput>({
        model: 'xai/grok-4-fast',
        messages: [{ role: 'user', content: prompt }]
    });
}
