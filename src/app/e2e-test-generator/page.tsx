'use server';
import { generateE2eTest } from '@/ai/flows/generate-e2e-test-flow';
import { E2eTestGeneratorForm } from './_components/e2e-test-generator-form';

export default async function E2eTestGeneratorPage() {
  async function getTest(data: { url: string; task: string }) {
    'use server';
    return await generateE2eTest(data);
  }

  return <E2eTestGeneratorForm getTest={getTest} />;
}
