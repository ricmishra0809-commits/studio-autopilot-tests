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
  ShieldCheck,
  ClipboardCheck,
  Video,
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
    title: 'Security Rules',
    description: 'Get AI-powered suggestions to improve your Firestore security.',
    href: '/security-rules',
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Summarize CI',
    description: 'Paste raw CI logs to get a clean, AI-generated summary.',
    href: '/summarize-ci',
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
  },
  {
    title: 'AI Test Agent',
    description: 'Let an AI agent explore your app and find bugs automatically.',
    href: '/ai-agent',
    icon: <Bot className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Test Video Gen',
    description: 'Generate a video clip of a test scenario using AI.',
    href: '/test-video',
    icon: <Video className="w-8 h-8 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="relative rounded-xl overflow-hidden bg-card p-8 border">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20" />
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
          <Card key={feature.href} className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1.5">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                {feature.icon}
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="secondary" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Link href={feature.href}>
                  Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
