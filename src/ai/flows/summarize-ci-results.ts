'use server';

/**
 * @fileOverview A flow that summarizes CI test results using AI.
 */
import { callOpenRouterWithJson } from '@/lib/openrouter';
import { z } from 'zod';

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
  const prompt = `You are an expert QA automation engineer and your goal is to summarize CI test results.

  Given the following test results, provide a concise summary of the results, highlighting any failures, errors, or important observations. If there are failures, provide details on the cause and impact.

  Test Results:
  ${input.testResults}
  
  Return the output as a JSON object that strictly follows this Zod schema:
  ${JSON.stringify(SummarizeCIResultsOutputSchema.shape)}
  `;

  return callOpenRouterWithJson<SummarizeCIResultsOutput>({
    model: 'xai/grok-4-fast',
    messages: [{ role: 'user', content: prompt }]
  });
}
