'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bot, Clipboard, Check } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock } from '@/components/shared/code-block';
import type { GenerateE2eTestOutput } from '@/ai/flows/generate-e2e-test-flow';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  task: z.string().min(10, {
    message: 'Task must be at least 10 characters.',
  }),
});

type AiAgentFormProps = {
  getTest: (data: z.infer<typeof formSchema>) => Promise<GenerateE2eTestOutput>;
};

export function AiAgentForm({ getTest }: AiAgentFormProps) {
  const [result, setResult] = useState<GenerateE2eTestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      task: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getTest(values);
      setResult(response);
    } catch (e: any) {
      console.error(e);
      // You might want to set an error state here to show in the UI
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="E2E Test Case Generator"
        description="Provide a URL and a task. The AI will analyze the page's HTML and generate a Playwright test script to accomplish the task."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Application URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL of the web page you want to test.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Task to Perform</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Click the login button, fill in the email with test@example.com, fill in the password with password123, and click submit.'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the steps you want the test to perform in plain English.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Analyzing & Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" /> Generate Test
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
          <p className="ml-4 text-muted-foreground">AI is analyzing the page and writing your test...</p>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Playwright Test</CardTitle>
            <CardDescription>
              Copy this code into a test file (e.g., `tests/example.spec.ts`) and run it with Playwright.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={result.playwrightCode} language="typescript" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
