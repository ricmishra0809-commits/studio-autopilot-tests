
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, ClipboardCheck, FileText, Rocket, Server } from 'lucide-react';
import React from 'react';

const workflowSteps = [
  {
    title: '1. Plan & Generate',
    icon: <FileText className="h-8 w-8 mb-4 text-primary" />,
    description: 'Start by generating a test strategy and the necessary test scripts (Jest, Playwright, etc.) using AI based on your project details.',
    substeps: ['Generate Test Strategy', 'Generate Test Scripts'],
  },
  {
    title: '2. Execute & Test',
    icon: <Server className="h-8 w-8 mb-4 text-primary" />,
    description: 'Trigger the tests automatically on a code push (e.g., via GitHub Actions) or manually. The tests run inside the Firebase Emulator.',
    substeps: ['Code Push Trigger', 'Run Emulator Tests'],
  },
  {
    title: '3. Analyze & Report',
    icon: <ClipboardCheck className="h-8 w-8 mb-4 text-primary" />,
    description: 'After the tests are complete, an AI model summarizes the results. The summary is then sent to your team via Slack or Email.',
    substeps: ['Summarize Results with AI', 'Notify Team'],
  },
  {
    title: '4. Autonomous Testing',
    icon: <Bot className="h-8 w-8 mb-4 text-primary" />,
    description: 'Deploy an autonomous AI agent to explore your app like a real user, discovering bugs and recording its session.',
    substeps: ['Run AI Test Agent', 'Get Session Video'],
  },
  {
    title: '5. Deploy',
    icon: <Rocket className="h-8 w-8 mb-4 text-primary" />,
    description: 'If all tests pass successfully, the new version of your application is automatically deployed to Firebase Hosting.',
    substeps: ['Conditional Deploy'],
  },
];

export default function WorkflowPage() {
  return (
    <div>
      <PageHeader
        title="The AutoPilot Workflow"
        description="From generation to deployment, understand how Studio AutoPilot creates a fully automated testing and deployment pipeline for your project."
      />
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-center gap-4">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex-1 flex">
                <Card className="group relative flex flex-col w-full overflow-hidden bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5">
                   <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-white/5 to-transparent transition-all duration-300 group-hover:from-white/10" />
                  <CardHeader className="relative z-10 text-center items-center">
                    {step.icon}
                    <CardTitle className="text-lg font-headline">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex-grow">
                    <p className="text-sm text-center text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>

              {index < workflowSteps.length - 1 && (
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-muted-foreground hidden lg:block" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
       <div className="mt-12">
        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle>Putting It All Together</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>The entire workflow is designed to be seamless. You can use our provided artifacts, like the **n8n Workflow JSON** or the **GitHub Actions config**, to set up this pipeline in minutes.</p>
            <p>The goal is to free you from manual testing and deployment, allowing you to focus on building great features. Studio AutoPilot handles the repetitive, time-consuming tasks with the power of AI, ensuring your app is always well-tested and ready to ship.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
