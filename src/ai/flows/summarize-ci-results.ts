// SummarizeCIResults Flow
'use server';

/**
 * @fileOverview A Genkit flow that summarizes CI test results using AI.
 *
 * - summarizeCIResults - A function that summarizes CI test results.
 * - SummarizeCIResultsInput - The input type for the summarizeCIResults function.
 * - SummarizeCIResultsOutput - The return type for the summarizeCIResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCIResultsInputSchema = z.object({
  testResults: z
    .string()
    .describe('The raw test results from the CI run.'),
});
export type SummarizeCIResultsInput = z.infer<typeof SummarizeCIResultsInputSchema>;

const SummarizeCIResultsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the test results.'),
  details: z
    .string()
    .optional()
    .describe('Optional detailed analysis of test failures or important observations.'),
});
export type SummarizeCIResultsOutput = z.infer<typeof SummarizeCIResultsOutputSchema>;

export async function summarizeCIResults(input: SummarizeCIResultsInput): Promise<SummarizeCIResultsOutput> {
  return summarizeCIResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCIResultsPrompt',
  input: {schema: SummarizeCIResultsInputSchema},
  output: {schema: SummarizeCIResultsOutputSchema},
  prompt: `You are an expert QA automation engineer and your goal is to summarize CI test results.

  Given the following test results, provide a concise summary of the results, highlighting any failures, errors, or important observations. If there are failures, provide details on the cause and impact.

  Test Results:
  {{testResults}}
  `,
});

const summarizeCIResultsFlow = ai.defineFlow(
  {
    name: 'summarizeCIResultsFlow',
    inputSchema: SummarizeCIResultsInputSchema,
    outputSchema: SummarizeCIResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
