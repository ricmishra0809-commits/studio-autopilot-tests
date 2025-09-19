import Link from 'next/link';
import {
  CheckCircle,
  Zap,
  TestTube,
  Rocket,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TypewriterEffect } from '@/components/shared/typewriter-effect';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Test Generation',
    description:
      'Automatically generate unit, integration, and E2E tests from your project specifications, saving you hundreds of hours.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Autonomous AI Test Agent',
    description:
      'Deploy an AI agent that explores your app, finds bugs, and records video of its session, just like a real user.',
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: 'Automated CI/CD Pipeline',
    description:
      "Integrate with your repository to run tests and deploy to production automatically on every code push. It's truly hands-free.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Security Rule Auditing',
    description:
      'Let our AI analyze your Firestore security rules, find vulnerabilities, and suggest improvements to keep your data safe.',
  },
];

const steps = [
  {
    name: 'Plan & Generate',
    description: 'AI generates your test strategy and scripts.',
  },
  {
    name: 'Execute Tests',
    description: 'Tests are automatically run in a CI/CD pipeline.',
  },
  {
    name: 'Deploy',
    description: 'On success, your app is deployed to production.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl font-headline">
              Studio AutoPilot
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>
          <div className="container relative z-10">
            <TypewriterEffect 
              text="Automate Your Testing. Ship Faster."
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-4"
              cursorClassName="text-4xl md:text-6xl"
            />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Studio AutoPilot is an AI-powered copilot that writes, runs, and
              manages your tests, so you can focus on building what matters.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                <Zap className="mr-2" /> Start Automating Now
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
              A Testing Suite That Thinks for You
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group relative flex flex-col overflow-hidden bg-card border rounded-xl transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5"
                >
                   <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-white/5 to-transparent transition-all duration-300 group-hover:from-white/10" />
                  <CardHeader className="relative z-10 flex flex-row items-center gap-4">
                    <div className="p-3 bg-card border rounded-lg">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-headline">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
              3 Simple Steps to Full Automation
            </h2>
            <div className="relative">
              {/* The connecting line */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>

              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background mb-4 font-bold text-xl z-10">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.name}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Studio AutoPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
