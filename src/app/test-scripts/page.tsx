'use server';
import { generateAutomatedTests } from '@/ai/flows/generate-automated-tests';
import { TestScriptsForm } from './_components/test-scripts-form';

export default async function TestScriptsPage() {
  async function getScripts(data: {
    backend: string;
    tools: string;
    firestoreSchema: string;
    functionsCode: string;
  }) {
    'use server';
    return await generateAutomatedTests(data);
  }

  return <TestScriptsForm getScripts={getScripts} />;
}
