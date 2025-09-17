'use server';
import { generateTestVideo } from '@/ai/flows/generate-test-video';
import { TestVideoForm } from './_components/test-video-form';

// The timeout for this server action is now configured in next.config.ts
export const maxDuration = 120; // 2 minutes

export default async function TestVideoPage() {
  async function getVideo(data: { prompt: string }) {
    'use server';
    return await generateTestVideo(data);
  }

  return <TestVideoForm getVideo={getVideo} />;
}
