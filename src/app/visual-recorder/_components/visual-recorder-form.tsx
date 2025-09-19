'use client';

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/shared/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Play, Square, MousePointerSquare, TriangleAlert } from 'lucide-react';
import type { VisualTestSessionOutput } from '@/ai/flows/record-visual-test';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

type VisualRecorderFormProps = {
  runSession: (data: any) => Promise<VisualTestSessionOutput>;
};

export function VisualRecorderForm({ runSession }: VisualRecorderFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [recordedActions, setRecordedActions] = useState<string[] | null>(null);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: 'https://www.google.com',
    },
  });

  const handleStartRecording = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setGeneratedWorkflow(null);
    setRecordedActions(null);

    try {
      const response = await runSession({ action: 'start', url: values.url });
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }
      setSessionId(response.sessionId);
      setScreenshot(response.screenshot);
      setIsRecording(true);
    } catch (e: any) {
      setError(`Failed to start session: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopRecording = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runSession({ action: 'finish', sessionId });
      if (response.error) {
        setError(response.error);
      } else {
        setGeneratedWorkflow(response.generatedWorkflow);
      }
    } catch (e: any) {
      setError(`Failed to stop session: ${e.message}`);
    } finally {
      setIsRecording(false);
      setIsLoading(false);
      setSessionId(null);
      setScreenshot(null);
    }
  };

  const handleImageClick = async (event: React.MouseEvent<HTMLImageElement>) => {
    if (!isRecording || isLoading) return;

    setIsLoading(true);
    setError(null);

    const image = imageRef.current;
    if (!image) return;

    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    const renderedWidth = image.offsetWidth;
    const renderedHeight = image.offsetHeight;

    const scaledX = Math.round(x * (naturalWidth / renderedWidth));
    const scaledY = Math.round(y * (naturalHeight / renderedHeight));

    try {
      const response = await runSession({ action: 'click', sessionId, x: scaledX, y: scaledY });
      if (response.error) {
        setError(response.error);
      } else {
        setScreenshot(response.screenshot);
        if (response.recordedActions) {
          setRecordedActions(response.recordedActions);
        }
      }
    } catch (e: any) {
      setError(`Action failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Visual Test Recorder"
        description="Click on your app's live preview to automatically record actions and generate a Playwright test workflow."
      />

      {error && (
        <Alert variant="destructive" className="mb-8">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isRecording && !generatedWorkflow && (
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleStartRecording)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Application URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourapp.com" {...field} disabled={isLoading}/>
                      </FormControl>
                      <FormDescription>The website you want to record a test for.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <Play className="mr-2" />
                  )}
                  Start Recording
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {isRecording && (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Recording Session...</span>
                        <Button onClick={handleStopRecording} disabled={isLoading} variant="destructive" size="lg">
                            {isLoading ? <LoadingSpinner className="mr-2" /> : <Square className="mr-2" />}
                            Finish Recording
                        </Button>
                    </CardTitle>
                    <CardDescription>Click on the image below to perform actions. The AI will interpret your clicks and generate a test script.</CardDescription>
                </CardHeader>
                <CardContent>
                    {screenshot ? (
                        <div className="relative">
                            <Image
                                ref={imageRef}
                                src={screenshot}
                                alt="Application Screenshot"
                                width={1280}
                                height={720}
                                onClick={handleImageClick}
                                className={cn("rounded-md border-2 border-primary cursor-crosshair", isLoading && "opacity-50 pointer-events-none")}
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                    <LoadingSpinner className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="flex items-center justify-center p-8 text-center h-[400px]">
                            <LoadingSpinner className="h-12 w-12" />
                            <p className="mt-4 text-lg text-muted-foreground">Loading initial page...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {recordedActions && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recorded Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock code={recordedActions.join('\n')} language="javascript" />
                    </CardContent>
                </Card>
            )}
        </div>
      )}

      {generatedWorkflow && (
        <div className="space-y-8">
            <Alert>
                <MousePointerSquare className="h-4 w-4" />
                <AlertTitle>Recording Finished!</AlertTitle>
                <AlertDescription>
                    Below is your generated Playwright workflow. You can copy this code into a new test file.
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader><CardTitle>Generated Playwright Workflow</CardTitle></CardHeader>
                <CardContent>
                    <CodeBlock code={generatedWorkflow.actions.join('\n')} language="javascript" />
                </CardContent>
            </Card>
            {generatedWorkflow.videoUri && (
                <Card>
                    <CardHeader><CardTitle>Session Recording</CardTitle></CardHeader>
                    <CardContent>
                         <video
                            src={generatedWorkflow.videoUri}
                            controls
                            className="w-full rounded-md border"
                        />
                    </CardContent>
                </Card>
            )}
             <Button onClick={() => setGeneratedWorkflow(null)} size="lg">Start New Recording</Button>
        </div>
      )}
    </div>
  );
}
