import {genkit} from 'genkit';
import {googleAI, gemini15Pro} from '@genkit-ai/googleai';
import {z} from 'zod';

export const ai = genkit({
  plugins: [googleAI()],
});

// Define a custom OpenAI-compatible model using the googleAI plugin's machinery
const openRouterModel = ai.defineModel(
  {
    name: 'openai/gpt-4o-mini',
    label: 'OpenRouter - GPT-4o Mini',
    configSchema: gemini15Pro.configSchema,
    supportedCallTypes: ['generate'],
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
    const newRequest = {
      ...request,
      generationConfig: {
        ...request.config,
        // OpenRouter uses 'model' in the body, not the URL
        model: 'openai/gpt-4o-mini',
      },
    };
    return (client as any).generate(newRequest);
  }
);


// We are setting the model on the global `ai` object after it has been defined.
// This is a bit of a workaround because the model itself uses `ai.generate`.
// @ts-ignore
ai.model = openRouterModel;
