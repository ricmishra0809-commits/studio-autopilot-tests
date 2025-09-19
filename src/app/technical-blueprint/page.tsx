
'use client';

import { PageHeader } from '@/components/shared/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { technicalBlueprintContent } from '@/lib/constants';
import { CodeBlock } from '@/components/shared/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const renderContent = (content: string) => {
    // Split by ``` to handle code blocks
    return content.split('```').map((part, index) => {
      if (index % 2 === 1) {
        // This part is a code block
        const codeLines = part.split('\n');
        const language = codeLines.shift(); // First line is language identifier
        const code = codeLines.join('\n');
        return <CodeBlock key={index} code={code} language={language} className="my-4" />;
      }
      
      // This part is regular text, process line by line
      return part.split('\n').map((line, lineIndex) => {
        const key = `${index}-${lineIndex}`;
        
        if (line.startsWith('## ')) {
          return <h2 key={key} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b">{line.substring(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={key} className="text-xl font-semibold mt-6 mb-2">{line.substring(4)}</h3>
        }
        if (line.startsWith('*   **')) {
           const boldPart = line.match(/\*\*(.*?)\*\*/);
           const rest = line.replace(/\*   \*\*(.*?)\*\*: /, '');
           return (
             <li key={key} className="mb-2 ml-4 text-muted-foreground">
               <strong className="text-foreground">{boldPart ? boldPart[1] : ''}:</strong> {rest}
             </li>
           );
        }
         if (line.startsWith('*   ')) {
           return <li key={key} className="mb-2 ml-4 text-muted-foreground list-disc">{line.substring(4)}</li>;
        }
        if (line.trim() === '') return null;
        return <p key={key} className="mb-4 text-muted-foreground">{line}</p>
      });
    });
  }

export default function TechnicalBlueprintPage() {
  return (
    <div>
      <PageHeader
        title="Technical Blueprint"
        description="An outline of the technical architecture, stack, and key components of the Studio AutoPilot application."
      />
      <Card>
        <CardContent className="pt-6">
            {renderContent(technicalBlueprintContent)}
        </CardContent>
      </Card>
    </div>
  );
}

