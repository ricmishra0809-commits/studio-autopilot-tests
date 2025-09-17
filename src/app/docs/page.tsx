import { PageHeader } from '@/components/shared/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { docsContent } from '@/lib/constants';
import { CodeBlock } from '@/components/shared/code-block';

// A simple markdown-like renderer
const renderContent = (content: string) => {
  return content.split('```').map((part, index) => {
    if (index % 2 === 1) {
      const [lang, ...code] = part.split('\n');
      return <CodeBlock key={index} code={code.join('\n')} language={lang} className="my-4" />;
    }
    return part.split('\n').map((line, lineIndex) => {
      if (line.startsWith('### ')) {
        return <h3 key={`${index}-${lineIndex}`} className="text-xl font-semibold mt-6 mb-2">{line.substring(4)}</h3>
      }
      if (line.trim() === '') return null;
      return <p key={`${index}-${lineIndex}`} className="mb-2 text-muted-foreground">{line}</p>
    });
  });
}

export default function DocsPage() {
  return (
    <div>
      <PageHeader
        title="Documentation & Runbook"
        description="Everything you need to get started, run tests, and debug issues with your Firebase testing automation setup."
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Local Setup</CardTitle>
            <CardDescription>
              Commands to set up and run the testing environment on your local machine.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent(docsContent.setup)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CI/CD Setup</CardTitle>
            <CardDescription>
              Instructions for configuring the GitHub Actions workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent(docsContent.ciCd)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Debugging Guide</CardTitle>
            <CardDescription>
              Steps to troubleshoot common issues with tests or deployments.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent(docsContent.debugging)}</CardContent>
        </Card>
      </div>
    </div>
  );
}
