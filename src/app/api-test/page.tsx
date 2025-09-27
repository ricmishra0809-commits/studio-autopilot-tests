import { ApiTestForm } from './_components/api-test-form';
import { runApiTest } from '@/ai/flows/api-test-flow';

export default async function ApiTestPage() {
  async function performTest(data: { query: string; model: string }) {
    'use server';
    return await runApiTest(data);
  }

  return <ApiTestForm performTest={performTest} />;
}
