'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import type { SummarizeCIResultsOutput } from '@/ai/flows/summarize-ci-results';

const formSchema = z.object({
  testResults: z.string().min(20, {
    message: 'Test results must be at least 20 characters.',
  }),
});

type SummarizeCiFormProps = {
  getSummary: (data: z.infer<typeof formSchema>) => Promise<SummarizeCIResultsOutput>;
};

export function SummarizeCiForm({ getSummary }: SummarizeCiFormProps) {
  const [result, setResult] = useState<SummarizeCIResultsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testResults: `TAP version 13
# Subtest: src/sum.test.ts
    # Subtest: sum()
        ok 1 - should correctly sum two numbers
        1..1
    ok 1 - src/sum.test.ts
    1..1
# tests 2
# pass 2
# fail 0
# skip 0
# todo 0
# duration_ms 42.1`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getSummary(values);
      setResult(response);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Summarize CI Test Results"
        description="Paste the raw output from your CI test run to get a concise, human-readable summary, highlighting key results and failures."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="testResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Raw Test Results</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the raw text output from your CI job here..."
                        className="min-h-[250px] font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The complete log output from your test runner (e.g., Jest, Playwright).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Summarizing...
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner className="h-8 w-8" />
          <p className="ml-4 text-muted-foreground">AI is processing the results...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
               {result.summary.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </CardContent>
          </Card>
          {result.details && (
             <Card>
                <CardHeader>
                <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                    {result.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
