import { AIAgentForm } from './_components/ai-agent-form';
import { exploreAndTestApp } from '@/ai/flows/explore-and-test-app';
import { devices } from 'playwright';

// Set the timeout for this specific page.
// This is a server-rendered page, so this export is valid here.
export const maxDuration = 120; // 2 minutes

export default async function AiAgentPage() {
  async function runAgent(data: { url: string; task: string, device?: string }) {
    'use server';
    return await exploreAndTestApp(data);
  }

  const deviceNames = Object.keys(devices);
  
  // Add a default option, but filter out the empty string for the SelectItems
  const supportedDevices = ["Default (Desktop)", ...deviceNames];

  return <AIAgentForm runAgent={runAgent} supportedDevices={supportedDevices} />;
}
