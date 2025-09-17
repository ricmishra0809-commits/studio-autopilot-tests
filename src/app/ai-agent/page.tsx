'use server';
import { AIAgentForm } from './_components/ai-agent-form';
import { exploreAndTestApp } from '@/ai/flows/explore-and-test-app';
import { devices } from 'playwright';

// Increase the timeout for this specific server action, as the agent can take time.
export const maxDuration = 120; // 2 minutes

export default async function AiAgentPage() {
  async function runAgent(data: { url: string; task: string, device?: string }) {
    'use server';
    return await exploreAndTestApp(data);
  }

  const deviceNames = Object.keys(devices);

  return <AIAgentForm runAgent={runAgent} supportedDevices={deviceNames} />;
}
