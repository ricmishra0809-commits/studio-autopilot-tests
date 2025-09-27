'use server';
import { generateE2eTest } from '@/ai/flows/generate-e2e-test-flow';
import { AiAgentForm } from './_components/ai-agent-form';

export default async function AiAgentPage() {
  async function getTest(data: {
    url: string;
    task: string;
  }) {
    'use server';
    return await generateEeTest(data);
  }

  return <AiAgentForm getTest={getTest} />;
}
