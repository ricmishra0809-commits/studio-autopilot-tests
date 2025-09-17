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
import { FileCode2 } from 'lucide-react';
import type { GenerateAutomatedTestsOutput } from '@/ai/flows/generate-automated-tests';

const formSchema = z.object({
  backend: z.string().min(10),
  tools: z.string().min(10),
  firestoreSchema: z.string().min(10),
  functionsCode: z.string().min(10),
});

type TestScriptsFormProps = {
  getScripts: (data: z.infer<typeof formSchema>) => Promise<GenerateAutomatedTestsOutput>;
};

export function TestScriptsForm({ getScripts }: TestScriptsFormProps) {
  const [result, setResult] = useState<GenerateAutomatedTestsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backend: 'Firebase Auth, Firestore, Firebase Functions, Hosting',
      tools: 'Firebase Emulator, Playwright (E2E), Jest (Unit tests), Supertest (API)',
      firestoreSchema: `// users/{userId}
//   - displayName: string
//   - email: string
//
// projects/{projectId}
//   - ownerId: string (userId)
//   - name: string`,
      functionsCode: `const functions = require('firebase-functions');
exports.sayHello = functions.https.onCall((data, context) => {
  return { message: \`Hello, \${data.name}!\` };
});`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getScripts(values);
      setResult(response);
    } catch (error) {
      console.error('Error generating scripts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Automated Test Script Generation"
        description="Provide details about your Firebase project, and our AI will generate ready-to-use test scripts for Jest, Playwright, and more."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="backend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backend Services</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Firebase Auth, Firestore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testing Tools</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Jest, Playwright" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="firestoreSchema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firestore Schema</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your collections and documents..." className="min-h-[150px] font-code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="functionsCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firebase Functions Code</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste relevant Cloud Functions code..." className="min-h-[150px] font-code" {...field} />
                    </FormControl>
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
                  <FileCode2 className="mr-2 h-4 w-4" />
                  Generate Scripts
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
          <p className="ml-4 text-muted-foreground">AI is writing your tests...</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Jest Unit Tests</CardTitle></CardHeader>
                <CardContent><CodeBlock code={result.jestUnitTests} language="javascript" /></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Firestore Security Rules Tests</CardTitle></CardHeader>
                <CardContent><CodeBlock code={result.firestoreSecurityRulesTests} language="javascript" /></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Playwright E2E Tests</CardTitle></CardHeader>
                <CardContent><CodeBlock code={result.playwrightE2ETests} language="javascript" /></CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>API Tests (Supertest)</CardTitle></CardHeader>
                <CardContent><CodeBlock code={result.apiTests} language="javascript" /></CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
