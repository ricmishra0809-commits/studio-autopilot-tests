'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import type { ExploreAndTestAppOutput } from '@/ai/flows/explore-and-test-app';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  task: z.string().min(10, {
    message: 'Task description must be at least 10 characters.',
  }),
  device: z.string().optional(),
});

type AiAgentFormProps = {
  runAgent: (data: z.infer<typeof formSchema>) => Promise<ExploreAndTestAppOutput>;
  supportedDevices: string[];
};

export function AIAgentForm({ runAgent, supportedDevices }: AiAgentFormProps) {
  const [result, setResult] = useState<ExploreAndTestAppOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: 'https://www.google.com',
      task: 'Search for "Firebase Studio" and take a screenshot of the results.',
      device: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runAgent(values);
      setResult(response);
    } catch (error) {
      console.error('Error running AI agent:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Test Agent"
        description="Deploy an autonomous AI agent to explore your web application and test its functionality based on a high-level task."
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Application URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourapp.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The starting URL for the AI agent to begin its exploration.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="device"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Device Emulation</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a device to emulate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="h-72">
                            <SelectItem value="">Default (Desktop)</SelectItem>
                            {supportedDevices.map(device => (
                              <SelectItem key={device} value={device}>{device}</SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Test how your app looks and behaves on different devices.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Task to Perform</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Sign up for a new account using a test email and then navigate to the profile page.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the goal for the AI agent in plain English.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Deploying Agent...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Run AI Agent
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <LoadingSpinner className="h-12 w-12" />
          <p className="mt-4 text-lg text-muted-foreground">AI agent is exploring the application...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Testing Summary</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              {result.summary.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
             <h3 className="text-2xl font-bold font-headline">Agent Steps</h3>
            {result.steps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Step {index + 1}: {step.observation}</CardTitle>
                  <p className="text-sm text-muted-foreground font-code">{step.action}</p>
                </CardHeader>
                <CardContent>
                  <Image
                    src={step.screenshot}
                    alt={`Screenshot of step ${index + 1}`}
                    width={1280}
                    height={720}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
