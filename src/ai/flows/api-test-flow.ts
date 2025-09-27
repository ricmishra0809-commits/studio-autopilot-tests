'use server';
/**
 * @fileOverview A simple flow to test any OpenRouter model by name.
 */

import { callOpenRouter } from '@/lib/openrouter';
import { z } from 'zod';

const ApiTestInputSchema = z.object({
  query: z.string().describe('A simple query to send to the model.'),
  model: z.string().describe('The name of the OpenRouter model to test (e.g., "google/gemma-7b-it").'),
});
export type ApiTestInput = z.infer<typeof ApiTestInputSchema>;

const ApiTestOutputSchema = z.object({
  response: z.string().describe('The response from the model.'),
});
export type ApiTestOutput = z.infer<typeof ApiTestOutputSchema>;

export async function runApiTest(input: ApiTestInput): Promise<ApiTestOutput> {
    const systemPrompt = `You are an API testing assistant for OpenRouter. Your sole purpose is to confirm that the API connection is working for the current model.
Respond to the user's query with a short, technical confirmation message that includes the model name you are.
Example: "API connection successful for [Model Name]. Received and processed query."
Do not use any informal language or greetings.`;

    const responseText = await callOpenRouter({
        model: input.model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input.query }
        ]
    });
    
    return { response: responseText };
}
