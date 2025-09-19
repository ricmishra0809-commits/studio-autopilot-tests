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
import { Video } from 'lucide-react';
import type { GenerateTestVideoOutput } from '@/ai/schemas/generate-test-video';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
});

type TestVideoFormProps = {
  getVideo: (data: z.infer<typeof formSchema>) => Promise<GenerateTestVideoOutput>;
};

export function TestVideoForm({ getVideo }: TestVideoFormProps) {
  const [result, setResult] = useState<GenerateTestVideoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A cinematic shot of a user successfully logging into a futuristic web application.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getVideo(values);
      setResult(response);
    } catch (error: any) {
      console.error('Error generating video:', error);
      setResult({ video: '', feedback: `An unexpected error occurred: ${error}`})
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Test Scenario Video Generation (Experimental)"
        description="Describe a test scenario in plain English and use Google's Veo model to generate a short video clip representing that scenario."
      />
      
      <Alert variant="destructive" className="mb-8">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Experimental Feature & Rate Limits</AlertTitle>
        <AlertDescription>
            This feature uses the Veo model which is highly experimental and has very strict rate limits. Video generation can take up to a minute and may fail frequently. If you get an error, please wait a few minutes before trying again.
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Video Scenario Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A user encounters a 404 error page on a modern e-commerce site.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the scene you want the AI to create. Be descriptive for best results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" /> Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate Video
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
          <p className="mt-4 text-lg text-muted-foreground">AI is generating the video...</p>
          <p className="text-sm text-muted-foreground">This can take up to a minute. Please be patient.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{result.feedback}</p>
                    {result.video && (
                        <video
                            src={result.video}
                            controls
                            className="w-full rounded-md border"
                            autoPlay
                            loop
                        />
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
