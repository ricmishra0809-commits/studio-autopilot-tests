'use client';

import { PageHeader } from '@/components/shared/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    title: 'Step 1: Start a New, Blank Workflow',
    description: "In your n8n dashboard, click on 'Add workflow' to start with a fresh, empty canvas. Do not import any files.",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step1_new_workflow.png',
  },
  {
    title: 'Step 2: Add a Webhook Trigger',
    description: "Click on 'Add first step', search for 'Webhook', and select it. This node will start your workflow when it receives a request (e.g., from a GitHub webhook). Copy the 'Test URL' for later use.",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step2_webhook.png',
  },
  {
    title: 'Step 3: Add the "Execute Command" Node',
    description: "Click the '+' below the Webhook node. Search for 'Execute Command' and select it. In the 'Command' field, enter: `firebase emulators:exec \"npm run test:all\"`",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step3_execute_command.png',
  },
  {
    title: 'Step 4: Add an "IF" Node to Check Results',
    description: "Click the '+' below the previous node and add an 'IF' node. Set a condition where `Value 1` is `{{ $json.exitCode }}`, the `Operation` is `Equal`, and `Value 2` is `0`. This checks if the tests passed.",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step4_if_node.png',
  },
  {
    title: 'Step 5: Add the Slack Node for Failures',
    description: "From the 'false' output of the IF node, add a 'Slack' node. In the 'Operation' field, search for and select 'Message' and then 'Post'.",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step5_slack_operation.png',
  },
  {
    title: 'Step 6: Configure the Slack Message',
    description: "Select your Slack credential. Set 'Send Message To' to 'Channel' and choose 'engineering-product-launch' from the list. In the 'Message Text' field, write: `❌ CI run failed! Check n8n logs.`",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step6_slack_config.png',
  },
  {
    title: 'Step 7: Add a "Deploy" Node for Success',
    description: "From the 'true' output of the IF node, add another 'Execute Command' node. In the 'Command' field, enter: `firebase deploy --only hosting`. This will deploy your app if tests pass.",
    imageUrl: 'https://storage.googleapis.com/studioprototyper/n8n_step7_deploy.png',
  },
];

export default function N8nWorkflowPage() {
  return (
    <div>
      <PageHeader
        title="n8n Workflow Setup Guide"
        description="A step-by-step visual guide to manually create your CI/CD workflow in n8n. Follow these images to build a reliable pipeline."
      />
      <div className="space-y-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Important: Use This Manual Guide</AlertTitle>
          <AlertDescription>
            Importing JSON files can be unreliable. Please follow these steps to build the workflow manually. This ensures all connections are set up correctly.
          </AlertDescription>
        </Alert>

        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full rounded-lg border">
                <Image
                  src={step.imageUrl}
                  alt={step.title}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Alert variant="default" className="bg-green-950/50 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertTitle className="text-green-300">Workflow Complete</AlertTitle>
          <AlertDescription className="text-green-400/80">
            Once you have followed all these steps, your n8n workflow will be fully configured and ready to use. You can now save it and activate it.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
