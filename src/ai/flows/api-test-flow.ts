'use server';
/**
 * @fileOverview A simple flow to test the OpenRouter API connection.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ApiTestInputSchema = z.object({
  query: z.string().describe('A simple query to send to the model.'),
});
export type ApiTestInput = z.infer<typeof ApiTestInputSchema>;

const ApiTestOutputSchema = z.object({
  response: z.string().describe('The response from the model.'),
});
export type ApiTestOutput = z.infer<typeof ApiTestOutputSchema>;

export async function runApiTest(input: ApiTestInput): Promise<ApiTestOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'apiTestPrompt',
      input: { schema: ApiTestInputSchema },
      output: { schema: ApiTestOutputSchema },
      model: 'openai/gpt-4o-mini',
      prompt: `You are an API testing assistant for OpenRouter. Your sole purpose is to confirm that the API connection is working.
Respond to the user's query: '{{{query}}}' with a short, technical confirmation message.
Example: "API connection successful. Received and processed query."
Do not use any informal language or greetings.`,
    },
  );

  const { output } = await prompt(input);
  return output!;
}
