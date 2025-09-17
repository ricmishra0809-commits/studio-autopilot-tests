'use client';
import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn("relative font-code text-sm shadow-md", className)}>
        <CardContent className="p-4">
            <pre className="p-0 m-0 bg-transparent overflow-x-auto">
                <code className={language ? `language-${language}` : ''}>{code}</code>
            </pre>
        </CardContent>
        <TooltipProvider>
            <Tooltip>
            <TooltipTrigger asChild>
                <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCopy}
                >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Clipboard className="h-4 w-4" />
                )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Copy to clipboard</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </Card>
  );
}
