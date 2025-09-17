import { AIAgentForm } from './_components/ai-agent-form';
import { exploreAndTestApp } from '@/ai/flows/explore-and-test-app';
import { devices } from 'playwright';

// The timeout for this server action is now configured in next.config.ts
export const maxDuration = 120; // 2 minutes

export default async function AiAgentPage() {
  async function runAgent(data: { url: string; task: string, device?: string }) {
    'use server';
    return await exploreAndTestApp(data);
  }

  const deviceNames = Object.keys(devices);
  
  // Add a default option
  const supportedDevices = ["", ...deviceNames];

  return <AIAgentForm runAgent={runAgent} supportedDevices={supportedDevices} />;
}
