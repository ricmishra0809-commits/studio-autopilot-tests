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
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, AlertTriangle } from 'lucide-react';
import type { GenerateE2eTestOutput } from '@/ai/flows/generate-e2e-test-flow';
import { Textarea } from '@/components/ui/textarea';
import { CodeBlock } from '@/components/shared/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  task: z.string().min(10, {
    message: 'Task must be at least 10 characters.',
  }),
});

type E2eTestGeneratorFormProps = {
  getTest: (data: z.infer<typeof formSchema>) => Promise<GenerateE2eTestOutput>;
};

export function E2eTestGeneratorForm({ getTest }: E2eTestGeneratorFormProps) {
  const [result, setResult] = useState<GenerateE2eTestOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    try {
      const response = await getTest(values);
      setResult(response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="E2E Test Case Generator"
        description="Generate Playwright test scripts by providing a URL and a task. The AI will analyze the page's HTML to create the test steps."
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
                      The URL of the page you want to test.
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
                        placeholder="e.g., 'Fill out the login form and click submit'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what you want the test to do in plain English.
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
                    <Bot className="mr-2 h-4 w-4" />
                    Generate Test Code
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
          <p className="ml-4 text-muted-foreground">
            AI is analyzing the page and writing your test...
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>
            <p>
              The AI failed to generate the test. This can happen if the URL is
              inaccessible or the task is too complex.
            </p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-destructive/20 p-2 font-mono text-xs">
              {error}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Playwright Test</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock code={result.playwrightCode} language="typescript" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
