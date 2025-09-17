'use server';
import { AIAgentForm } from './_components/ai-agent-form';
import { exploreAndTestApp } from '@/ai/flows/explore-and-test-app';

export default async function AiAgentPage() {
  async function runAgent(data: { url: string; task: string }) {
    'use server';
    return await exploreAndTestApp(data);
  }

  return <AIAgentForm runAgent={runAgent} />;
}
