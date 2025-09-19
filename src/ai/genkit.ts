import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

export const ai = genkit({
  plugins: [
    googleAI({
      // Disabling the default model so we can define our own.
      // We are still using the googleAI() plugin because it provides
      // the underlying machinery to call external APIs.
      // model: undefined, 
    }),
  ],
});

// Define a custom OpenAI-compatible model using OpenRouter
const openRouterModel = ai.defineModel(
  {
    name: 'openai/gpt-4o-mini',
    label: 'OpenRouter - GPT-4o Mini',
    // We can still use googleAI's config schema for simplicity
    // as it covers common properties.
    configSchema: z.object({
      temperature: z.number().optional(),
      topK: z.number().optional(),
      topP: z.number().optional(),
      maxOutputTokens: z.number().optional(),
      stopSequences: z.array(z.string()).optional(),
    }),
    // We are not specifying info here as it's not required for this custom model.
  },
  async (request, config) => {
    // This is a workaround to use googleAI's infrastructure to call an external
    // OpenAI-compatible API like OpenRouter.
    const client = (googleAI() as any).getClient(
      {
        ...config,
        // Override the API key and base URL to point to OpenRouter
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      },
      'generate'
    );

    // Translate the Genkit request to something the OpenAI API understands.
    const openAIRequest = {
      model: 'openai/gpt-4o-mini',
      messages: request.messages.map(msg => ({
        role: msg.role,
        content: msg.content.map(part => {
          if(part.text) return { type: 'text', text: part.text };
          if(part.media) return { type: 'image_url', image_url: { url: part.media.url } };
          return part;
        })
      })),
      stream: false, // Assuming non-streaming for simplicity in this example
      ...config,
    };
    
    // Call the OpenRouter API. The googleAI getClient returns a client that
    // has a `generate` method compatible with what we need.
    const response = await (client as any).generate(openAIRequest);

    // Translate the OpenAI response back to a Genkit response.
    return {
      candidates: response.choices.map((choice: any, index: number) => ({
        index,
        finishReason: choice.finish_reason,
        message: {
          role: 'model',
          content: [{ text: choice.message.content }],
        },
      })),
      usage: {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
    };
  }
);


// We are setting the model on the global `ai` object after it has been defined.
// This is a bit of a workaround because the model itself uses `ai.generate`.
// @ts-ignore
ai.model = openRouterModel;
