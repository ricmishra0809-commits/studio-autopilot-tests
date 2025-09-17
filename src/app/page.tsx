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
      <div className="relative rounded-xl overflow-hidden p-8 border bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute -inset-px rounded-xl border border-transparent [background:linear-gradient(var(--angle),theme(colors.primary/0.5),theme(colors.secondary/0.5))] [-webkit-mask-composite:xor] [-webkit-mask:linear-gradient(black,black)_content-box,linear-gradient(black,black)]" style={{'--angle': '0deg', animation: 'rotate 5s linear infinite'}} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 animated-gradient-text">
            Welcome to Firebase AutoPilot
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your AI-powered copilot for comprehensive, automated testing in Firebase.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1.5 border-transparent bg-secondary/20 hover:bg-secondary/50">
             <div className="absolute -inset-px rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-primary/50" />
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                <div className="p-2 bg-secondary/50 rounded-lg transition-all duration-300 group-hover:bg-primary/10 group-hover:shadow-[0_0_15px] group-hover:shadow-primary/50">
                  {feature.icon}
                </div>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="ghost" className="w-full bg-primary/10 text-primary-foreground/80 group-hover:bg-primary/80 group-hover:text-primary-foreground transition-colors">
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
