import {genkit} from 'genkit';
import {googleAI, geminiPro} from '@genkit-ai/googleai';
import {defineModel} from 'genkit/models';
import {z} from 'zod';

// Define a custom OpenAI-compatible model using the googleAI plugin's machinery
const openRouterModel = defineModel(
  {
    name: 'google/gemini-flash-1.5',
    label: 'OpenRouter - Gemini Flash 1.5',
    configSchema: geminiPro.configSchema,
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
        model: 'google/gemini-flash-1.5',
      },
    };
    return (client as any).generate(newRequest);
  }
);

export const ai = genkit({
  plugins: [googleAI()],
  model: openRouterModel,
});
