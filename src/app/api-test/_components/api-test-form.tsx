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
import { TestTube } from 'lucide-react';
import type { ApiTestOutput } from '@/ai/flows/api-test-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  query: z.string().min(2, {
    message: 'Query must be at least 2 characters.',
  }),
});

type ApiTestFormProps = {
  performTest: (data: z.infer<typeof formSchema>) => Promise<ApiTestOutput>;
};

export function ApiTestForm({ performTest }: ApiTestFormProps) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: 'Hello, who are you?',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await performTest(values);
      setResult(response.response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="OpenRouter API Test"
        description="Use this page to verify that your OpenRouter API key is working correctly with the 'gpt-4o-mini' model."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Test Query</FormLabel>
                    <FormControl>
                      <Input placeholder="Ask something..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Send a simple message to the AI model.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Run Test
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
          <p className="ml-4 text-muted-foreground">Sending request to OpenRouter...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
            <AlertTitle>API Test Failed</AlertTitle>
            <AlertDescription>
                <p className="font-bold">The API call to OpenRouter failed. Here's the error:</p>
                <pre className="mt-2 text-xs bg-black/20 p-2 rounded-md">{error}</pre>
                <p className="mt-4">Please double-check that your `OPENROUTER_API_KEY` in the `.env` file is correct and has funds.</p>
            </AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>API Test Successful!</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p className="font-bold text-green-400">Received response from gpt-4o-mini:</p>
            <p>{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
