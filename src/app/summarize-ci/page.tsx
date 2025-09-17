'use server';
import { summarizeCIResults } from '@/ai/flows/summarize-ci-results';
import { SummarizeCiForm } from './_components/summarize-ci-form';

export default async function SummarizeCiPage() {
  async function getSummary(data: { testResults: string }) {
    'use server';
    return await summarizeCIResults(data);
  }

  return <SummarizeCiForm getSummary={getSummary} />;
}
