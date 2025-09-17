/**
 * @fileOverview Schemas and types for the exploreAndTestApp flow.
 * This file contains the Zod schemas for input and output validation,
 * as well as the corresponding TypeScript types.
 */

import { z } from 'genkit';

export const ExploreAndTestAppInputSchema = z.object({
  url: z.string().url().describe('The URL of the web application to test.'),
  task: z.string().describe('The high-level task for the AI agent to perform.'),
  device: z.string().optional().describe('The device to emulate (e.g., "iPhone 13", "Pixel 5").'),
});
export type ExploreAndTestAppInput = z.infer<
  typeof ExploreAndTestAppInputSchema
>;

export const ExploreAndTestAppOutputSchema = z.object({
  summary: z.string().describe('A summary of the testing session.'),
  steps: z.array(
    z.object({
      action: z.string().describe('The action taken by the agent.'),
      screenshot: z.string().describe('A base64 encoded screenshot of the page after the action. As a data URI.'),
      observation: z.string().describe('The agent\'s observation after the action.'),
    })
  ),
  video: z.string().optional().describe('A base64 encoded video of the test session. As a data URI.'),
});
export type ExploreAndTestAppOutput = z.infer<
  typeof ExploreAndTestAppOutputSchema
>;

    