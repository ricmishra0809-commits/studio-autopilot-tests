import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  FileCode2,
  Workflow,
  Github,
  BookOpenText,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';

const features = [
  {
    title: 'Test Strategy',
    description: 'Generate a comprehensive test strategy for your Firebase project.',
    href: '/test-strategy',
    icon: <FileText className="w-8 h-8 text-primary" />,
    image: placeholderImages.find(p => p.id === 'card-strategy'),
  },
  {
    title: 'Test Scripts',
    description: 'Automatically create Jest, Playwright, and other test scripts.',
    href: '/test-scripts',
    icon: <FileCode2 className="w-8 h-8 text-primary" />,
    image: placeholderImages.find(p => p.id === 'card-scripts'),
  },
  {
    title: 'n8n Workflow',
    description: 'Get a ready-to-use n8n workflow for test automation.',
    href: '/n8n-workflow',
    icon: <Workflow className="w-8 h-8 text-primary" />,
    image: placeholderImages.find(p => p.id === 'card-workflow'),
  },
  {
    title: 'CI/CD Config',
    description: 'Bootstrap your CI/CD pipeline with a GitHub Actions config.',
    href: '/cicd-config',
    icon: <Github className="w-8 h-8 text-primary" />,
    image: placeholderImages.find(p => p.id === 'card-cicd'),
  },
  {
    title: 'Documentation',
    description: 'Access setup instructions and a runbook for your project.',
    href: '/docs',
    icon: <BookOpenText className="w-8 h-8 text-primary" />,
    image: placeholderImages.find(p => p.id === 'card-docs'),
  },
  {
    title: 'AI Tools',
    description: 'Enhance your testing with AI-powered analysis and suggestions.',
    href: '/summarize-ci',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    image: placeholderImages.find(p => p.id === 'card-ai'),
  },
];

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'dashboard-hero');
  return (
    <div className="space-y-12">
      <div className="relative rounded-xl overflow-hidden">
        {heroImage && (
           <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-headline">
            Welcome to Firebase AutoPilot
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Your AI-powered copilot for comprehensive, automated testing in Firebase.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300">
             {feature.image && (
                <div className="overflow-hidden">
                    <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={feature.image.imageHint}
                    />
                </div>
            )}
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
