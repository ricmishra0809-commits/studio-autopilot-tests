'use server';
import { generateTestStrategy } from '@/ai/flows/generate-test-strategy';
import { TestStrategyForm } from './_components/test-strategy-form';

export default async function TestStrategyPage() {
  async function getStrategy(data: {
    backendDetails: string;
    tools: string;
    goal: string;
  }) {
    'use server';
    return await generateTestStrategy(data);
  }

  return <TestStrategyForm getStrategy={getStrategy} />;
}
