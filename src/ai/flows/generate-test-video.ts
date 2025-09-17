'use server';

/**
 * @fileOverview An AI flow to generate a video based on a text prompt using Veo.
 *
 * - generateTestVideo - A function that generates a video of a test scenario.
 * - GenerateTestVideoInput - The input type for the generateTestVideo function.
 * - GenerateTestVideoOutput - The return type for the generateTestVideo function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
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

export async function generateTestVideo(input: GenerateTestVideoInput): Promise<GenerateTestVideoOutput> {
  let operation;
  try {
    const genkitResponse = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });
    operation = genkitResponse.operation;

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time.
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the operation result.');
    }

    // The URL from Veo is temporary and needs to be fetched.
    // It also requires an API key in the request.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
      `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download video file: ${videoDownloadResponse.statusText}`);
    }
    
    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');

    return {
      video: `data:video/mp4;base64,${videoBase64}`,
      feedback: 'Video generated successfully.',
    };
  } catch (error: any) {
    console.error('Error generating video with Veo:', error);
    return {
      video: '',
      feedback: `Error generating video: ${error.message}. Veo has very low rate limits, so this might be a temporary issue. Please try again in a few minutes.`,
    };
  }
}
