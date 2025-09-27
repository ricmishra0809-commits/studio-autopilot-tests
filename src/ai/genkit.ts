import {genkit, GenerationCommonConfigSchema} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

export const ai = genkit({
  plugins: [
    googleAI({
      // We are not using a default model from googleAI directly
      // but we need the plugin for its infrastructure.
    }),
  ],
  // We can add other configurations here if needed.
});

// Define a custom OpenAI-compatible model using OpenRouter
const openRouterModel = ai.defineModel(
  {
    name: 'xai/grok-4-fast',
    label: 'OpenRouter - Grok 4 Fast',
    configSchema: GenerationCommonConfigSchema,
    // We are not specifying info here as it's not required for this custom model.
  },
  async (request, config) => {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
    }

    const openAIRequest = {
      model: 'xai/grok-4-fast',
      messages: request.messages.map(msg => ({
        role: msg.role,
        content: msg.content.map(part => {
          if (part.text) return {type: 'text', text: part.text};
          if (part.media) return {type: 'image_url', image_url: {url: part.media.url}};
          return part;
        }),
      })),
      stream: false,
      ...config,
    };
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://example.com', // Replace with your actual app URL if needed
        'X-Title': 'Firebase Studio AutoPilot', // Optional
      },
      body: JSON.stringify(openAIRequest),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter API request failed with status ${response.status}: ${errorBody}`);
    }

    const responseData = await response.json();

    // Translate the OpenAI response back to a Genkit response.
    return {
      candidates: responseData.choices.map((choice: any, index: number) => ({
        index,
        finishReason: choice.finish_reason,
        message: {
          role: 'model',
          content: [{text: choice.message.content}],
        },
      })),
      usage: {
        inputTokens: responseData.usage.prompt_tokens,
        outputTokens: responseData.usage.completion_tokens,
        totalTokens: responseData.usage.total_tokens,
      },
    };
  }
);
