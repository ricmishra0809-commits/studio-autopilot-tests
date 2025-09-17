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
import { ShieldCheck } from 'lucide-react';
import type { SuggestSecurityRuleImprovementsOutput } from '@/ai/flows/suggest-security-rule-improvements';

const formSchema = z.object({
  securityRules: z.string().min(10, {
    message: 'Security rules must be at least 10 characters.',
  }),
  firestoreSchema: z.string().min(10, {
    message: 'Firestore schema must be at least 10 characters.',
  }),
});

type SecurityRulesFormProps = {
  getSuggestions: (data: z.infer<typeof formSchema>) => Promise<SuggestSecurityRuleImprovementsOutput>;
};

export function SecurityRulesForm({ getSuggestions }: SecurityRulesFormProps) {
  const [result, setResult] = useState<SuggestSecurityRuleImprovementsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      securityRules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // By default, deny all reads and writes
    match /{document=**} {
      allow read, write: if false;
    }

    // Allow logged-in users to read and create their own test runs
    match /test-runs/{runId} {
      allow read, create: if request.auth != null;
    }
  }
}`,
      firestoreSchema: `// collections:
// - test-runs (contains test results from the AI agent)`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getSuggestions(values);
      setResult(response);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI-Powered Security Rule Suggestions"
        description="Provide your current Firestore Security Rules and schema to get AI-powered suggestions for improving security and preventing vulnerabilities."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="securityRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Current Security Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your Firestore security rules here..."
                        className="min-h-[200px] font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The full content of your firestore.rules file.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firestoreSchema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Firestore Schema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your Firestore collection and document structure..."
                        className="min-h-[150px] font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A description of your collections, sub-collections, and document fields.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Analyzing...
                  </>
                ) : (
                  <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Get Suggestions
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
          <p className="ml-4 text-muted-foreground">AI is analyzing your rules...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-md overflow-x-auto font-code">{result.suggestions}</pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              {result.explanation.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
