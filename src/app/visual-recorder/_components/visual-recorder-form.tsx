'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Circle, MousePointerClick, Play, Square, Loader2, FileCode2 } from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CodeBlock } from '@/components/shared/code-block';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL to start recording.' }),
});

type RecordedAction = {
    action: string;
    params: any;
    timestamp: number;
}

type VisualRecorderFormProps = {
  generateWorkflow: (actions: RecordedAction[]) => Promise<string>;
};

export function VisualRecorderForm({ generateWorkflow }: VisualRecorderFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedActions, setRecordedActions] = useState<RecordedAction[]>([]);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>>) {
    setIsRecording(true);
    setRecordedActions([]);
    setGeneratedWorkflow(null);
    // Use a proxy to load the iframe content to avoid CORS issues, for now we load it directly
    // This will fail for many sites due to X-Frame-Options header.
    // A proper implementation requires a server-side proxy.
    setIframeUrl(values.url);
  }

  const stopRecording = () => {
    setIsRecording(false);
  }

  const handleGenerateWorkflow = async () => {
    if (recordedActions.length === 0) return;
    setIsGenerating(true);
    try {
        const workflow = await generateWorkflow(recordedActions);
        setGeneratedWorkflow(workflow);
    } catch (error) {
        console.error("Error generating workflow", error);
        setGeneratedWorkflow(`// Failed to generate workflow: ${error}`);
    } finally {
        setIsGenerating(false);
    }
  }
  
  // Placeholder for iframe interaction listener
  useEffect(() => {
    if (!isRecording || !iframeRef.current) return;

    const handleIframeLoad = () => {
        if(!iframeRef.current?.contentWindow) return;
        
        const logAction = (action: string, params: any) => {
            setRecordedActions(prev => [...prev, { action, params, timestamp: Date.now() }]);
        }

        const iframeDoc = iframeRef.current.contentWindow.document;

        const handleClick = (e: MouseEvent) => {
            // In a real implementation, we'd generate a robust selector here.
            const target = e.target as HTMLElement;
            logAction('click', { selector: `#${target.id}` || target.tagName.toLowerCase() });
        }
        
        const handleKeydown = (e: KeyboardEvent) => {
             if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                if (e.key === 'Enter') {
                    logAction('pressEnter', { value: e.target.value });
                }
            }
        }
        
        iframeDoc.addEventListener('click', handleClick);
        iframeDoc.addEventListener('keydown', handleKeydown, true);

        return () => {
            iframeDoc.removeEventListener('click', handleClick);
            iframeDoc.removeEventListener('keydown', handleKeydown, true);
        }
    }

    iframeRef.current.addEventListener('load', handleIframeLoad);
    return () => iframeRef.current?.removeEventListener('load', handleIframeLoad);

  }, [isRecording]);


  return (
    <div className="space-y-8">
      <PageHeader
        title="Visual Test Recorder"
        description="Record your interactions with a website and automatically convert them into a repeatable test workflow. Click, type, and navigate, and let the AI do the rest."
      />

      {!isRecording && !iframeUrl && (
         <Card>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-lg">Website URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the URL of the website you want to test.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <Button type="submit" size="lg">
                        <Play className="mr-2" />
                        Start Recording
                    </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      )}
     
      
      {(isRecording || iframeUrl) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                 <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {isRecording ? (
                            <>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Recording...
                            </>
                        ) : (
                            <span>Recording Stopped</span>
                        )}
                    </div>
                    <Button onClick={stopRecording} variant="destructive" size="sm" disabled={!isRecording}>
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                    </Button>
                </div>
                <Card className="aspect-[16/9] w-full overflow-hidden">
                    {iframeUrl ? (
                         <iframe
                            ref={iframeRef}
                            src={iframeUrl}
                            className="w-full h-full border-0"
                            sandbox="allow-scripts allow-same-origin"
                         />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">Enter a URL to start recording</p>
                        </div>
                    )}
                </Card>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Recorded Actions</CardTitle>
                        <CardDescription>The user actions captured from the session.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recordedActions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No actions recorded yet. Interact with the website on the left.</p>
                        ) : (
                            <ul className="space-y-2 text-sm font-mono text-muted-foreground">
                                {recordedActions.map((act, index) => (
                                    <li key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                        <MousePointerClick className="h-4 w-4" />
                                        <span>{act.action}({JSON.stringify(act.params)})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
                <Button onClick={handleGenerateWorkflow} disabled={recordedActions.length === 0 || isGenerating} className="w-full">
                    {isGenerating ? <LoadingSpinner className="mr-2" /> : <FileCode2 className="mr-2" />}
                    Generate Workflow
                </Button>
                {generatedWorkflow && (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Generated Workflow</h3>
                        <CodeBlock code={generatedWorkflow} language="typescript" />
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}
