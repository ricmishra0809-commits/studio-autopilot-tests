'use server';
import { generateTestVideo } from '@/ai/flows/generate-test-video';
import { TestVideoForm } from './_components/test-video-form';

// Increase the timeout for this specific server action
export const maxDuration = 120; // 2 minutes

export default async function TestVideoPage() {
  async function getVideo(data: { prompt: string }) {
    'use server';
    return await generateTestVideo(data);
  }

  return <TestVideoForm getVideo={getVideo} />;
}
