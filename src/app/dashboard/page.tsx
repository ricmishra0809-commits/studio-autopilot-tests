import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  FileCode2,
  ShieldCheck,
  ClipboardCheck,
  Video,
  Bot,
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
    description: 'Generate a comprehensive test strategy for your project.',
    href: '/test-strategy',
    icon: <FileText className="w-6 h-6 text-foreground/80" />,
  },
  {
    title: 'Test Scripts',
    description: 'Automatically create Jest, Playwright, and other test scripts.',
    href: '/test-scripts',
    icon: <FileCode2 className="w-6 h-6 text-foreground/80" />,
  },
  {
    title: 'Security Rules',
    description: 'Get AI-powered suggestions to improve your security.',
    href: '/security-rules',
    icon: <ShieldCheck className="w-6 h-6 text-foreground/80" />,
  },
  {
    title: 'Summarize CI',
    description: 'Paste raw CI logs to get a clean, AI-generated summary.',
    href: '/summarize-ci',
    icon: <ClipboardCheck className="w-6 h-6 text-foreground/80" />,
  },
  {
    title: 'AI Test Agent',
    description: 'Let an AI agent explore your app and find bugs automatically.',
    href: '/ai-agent',
    icon: <Bot className="w-6 h-6 text-foreground/80" />,
  },
  {
    title: 'Test Video Gen',
    description: 'Generate a video clip of a test scenario using AI.',
    href: '/test-video',
    icon: <Video className="w-6 h-6 text-foreground/80" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animated-gradient-text">
          Studio AutoPilot
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Your AI-powered copilot for comprehensive, automated testing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.href} className="group relative flex flex-col overflow-hidden bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-white/5 to-transparent transition-all duration-300 group-hover:from-white/10" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-headline">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-grow flex flex-col">
              <CardDescription className="flex-grow">{feature.description}</CardDescription>
              <div className="mt-6">
                <Button asChild variant="ghost" className="w-full justify-start p-0 h-auto text-sm font-normal text-muted-foreground hover:text-foreground transition-colors hover:bg-transparent">
                  <Link href={feature.href}>
                    Go to page <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
