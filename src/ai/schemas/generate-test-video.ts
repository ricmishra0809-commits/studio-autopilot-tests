/**
 * @fileOverview Schemas and types for the generateTestVideo flow.
 * This file contains the Zod schemas for input and output validation,
 * as well as the corresponding TypeScript types.
 */

import { z } from 'genkit';

export const GenerateTestVideoInputSchema = z.object({
  prompt: z.string().describe('A text description of the test scenario to generate a video for.'),
});
export type GenerateTestVideoInput = z.infer<typeof GenerateTestVideoInputSchema>;

export const GenerateTestVideoOutputSchema = z.object({
  video: z.string().describe('A base64 encoded video of the generated scenario. As a data URI.'),
  feedback: z.string().describe('Feedback on the video generation process.'),
});
export type GenerateTestVideoOutput = z.infer<typeof GenerateTestVideoOutputSchema>;
