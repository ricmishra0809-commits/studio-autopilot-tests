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
import { CodeBlock } from '@/components/shared/code-block';
import { FileText } from 'lucide-react';
import type { GenerateTestStrategyOutput } from '@/ai/flows/generate-test-strategy';

const formSchema = z.object({
  backendDetails: z.string().min(10, {
    message: 'Backend details must be at least 10 characters.',
  }),
  tools: z.string().min(10, {
    message: 'Tools description must be at least 10 characters.',
  }),
  goal: z.string().min(10, {
    message: 'Goal must be at least 10 characters.',
  }),
});

type TestStrategyFormProps = {
  getStrategy: (data: z.infer<typeof formSchema>) => Promise<GenerateTestStrategyOutput>;
};

export function TestStrategyForm({ getStrategy }: TestStrategyFormProps) {
  const [result, setResult] = useState<GenerateTestStrategyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backendDetails: 'Firebase Auth, Firestore, Firebase Functions, Hosting',
      tools:
        'Firebase Emulator, Playwright (E2E), Jest (Unit tests), Supertest (API), n8n workflows, GitHub Actions',
      goal:
        'On every code push -> run automated tests -> summarize results with AI -> notify team -> auto-deploy if tests pass.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getStrategy(values);
      setResult(response);
    } catch (error) {
      console.error('Error generating strategy:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Generate Test Strategy"
        description="Define your project's backend, tools, and goals to generate a comprehensive test strategy document, including coverage goals and framework recommendations."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="backendDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Backend Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Firebase Auth, Firestore, Functions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the Firebase services your project uses.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tools"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Tools & Frameworks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Playwright, Jest, n8n"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the testing and automation tools you plan to use.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Automation Goal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., On every push, run tests and deploy on success."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your desired CI/CD and automation outcome.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Generating...
                  </>
                ) : (
                  <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Strategy
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
          <p className="ml-4 text-muted-foreground">AI is crafting your strategy...</p>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Test Strategy Document</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            {result.testStrategyDocument.split('\n').map((line, i) => {
              if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-foreground font-semibold mt-4 mb-2 text-lg">{line.substring(4)}</h3>
              }
              if (line.startsWith('- ')) {
                  return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>
              }
              return <p key={i}>{line}</p>
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
