import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  FileCode2,
  Workflow,
  Github,
  BookOpenText,
  Sparkles,
  Rocket,
  Bot,
  Terminal,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Test Strategy',
    description: 'Generate a comprehensive test strategy for your Firebase project.',
    href: '/test-strategy',
    icon: <FileText className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Test Scripts',
    description: 'Automatically create Jest, Playwright, and other test scripts.',
    href: '/test-scripts',
    icon: <FileCode2 className="w-8 h-8 text-primary" />,
  },
  {
    title: 'n8n Workflow',
    description: 'Get a ready-to-use n8n workflow for test automation.',
    href: '/n8n-workflow',
    icon: <Workflow className="w-8 h-8 text-primary" />,
  },
  {
    title: 'CI/CD Config',
    description: 'Bootstrap your CI/CD pipeline with a GitHub Actions config.',
    href: '/cicd-config',
    icon: <Github className="w-8 h-8 text-primary" />,
  },
  {
    title: 'CI/CD Integration',
    description: 'Learn how to trigger the AI agent from your CI/CD pipeline.',
    href: '/cicd-integration',
    icon: <Terminal className="w-8 h-8 text-primary" />,
  },
  {
    title: 'AI Test Agent',
    description: 'Let an AI agent explore your app and find bugs automatically.',
    href: '/ai-agent',
    icon: <Bot className="w-8 h-8 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="relative rounded-xl overflow-hidden bg-card p-8 border">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center">
            <Rocket className="w-24 h-24 text-primary mb-4 animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-headline">
            Welcome to Firebase AutoPilot
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your AI-powered copilot for comprehensive, automated testing in Firebase.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                {feature.icon}
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="secondary" className="w-full group-hover:bg-accent group-hover:text-accent-foreground">
                <Link href={feature.href}>
                  Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
