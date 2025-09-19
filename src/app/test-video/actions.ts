'use server';
import { generateTestVideo } from '@/ai/flows/generate-test-video';

// Note: maxDuration cannot be exported from a 'use server' file.
// It should be exported from a server-rendered page or layout file.
// The timeout for this action will default to the project's setting.

export async function getVideo(data: { prompt: string }) {
  return await generateTestVideo(data);
}
