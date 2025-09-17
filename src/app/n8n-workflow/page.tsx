'use client';

import { PageHeader } from '@/components/shared/page-header';
import { CodeBlock } from '@/components/shared/code-block';
import { n8nWorkflowJson } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';

export default function N8nWorkflowPage() {
  return (
    <div>
      <PageHeader
        title="n8n Workflow"
        description="A no-code workflow to automate your entire testing and deployment pipeline. Copy the JSON below and import it into your n8n instance."
      />

      <div className="space-y-8">
        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle>Why Use n8n?</CardTitle>
            <CardDescription>
              n8n acts as the "brain" of your automation, connecting all the tools and services in your CI/CD pipeline without writing complex scripts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Visual Workflow Builder</h4>
                  <p>Instead of writing YAML files, you can visually design your entire CI/CD pipeline by connecting nodes. It's easier to build, understand, and maintain.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Hundreds of Integrations</h4>
                  <p>n8n has pre-built nodes for over 1,000 apps (Slack, Jira, Discord, Email, etc.). This makes it incredibly easy to send notifications or create tickets.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Easy Debugging</h4>
                  <p>You can see the data that flows through each step of your workflow, making it simple to find and fix errors when something goes wrong.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Direct AI Integration (The Best Part)
            </CardTitle>
            <CardDescription>
              n8n doesn't just run commands; it can directly integrate with AI models like OpenRouter or OpenAI.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
              <p>You don't need this application's server actions to use AI. n8n has its own AI nodes that you can use directly in your workflow.</p>
              <ul className="space-y-2 list-disc pl-5">
                  <li><strong className="text-foreground">Use the "OpenAI" Node:</strong> You can add the "OpenAI" node to your n8n workflow, provide your OpenRouter API Key and custom API endpoint, and ask it to summarize test results.</li>
                  <li><strong className="text-foreground">More Power, Less Dependency:</strong> This makes your automation more powerful and independent. Your n8n workflow is no longer dependent on this app's specific server actions to perform AI tasks.</li>
              </ul>
               <p>In short, n8n doesn't provide an AI model, but it gives you the tools to connect to any AI model you want, directly within your automation pipeline.</p>
          </CardContent>
        </Card>

        <CodeBlock code={n8nWorkflowJson} language="json" />
      </div>
    </div>
  );
}
