'use client';

import { PageHeader } from '@/components/shared/page-header';
import { CodeBlock } from '@/components/shared/code-block';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

// We fetch the content client-side to avoid server-side file reading
const fetchGuideContent = async () => {
  // In a real app, you might fetch this from a URL or have it statically imported
  const content = `# Playwright on Continuous Integration

This document is a comprehensive guide for setting up and running Playwright tests in various Continuous Integration (CI) environments.

## Introduction

Playwright tests can be executed in CI environments. We have created sample configurations for common CI providers.

3 steps to get your tests running on CI:

1.  **Ensure CI agent can run browsers:** Use our Docker image in Linux agents or install your dependencies using the CLI.

2.  **Install Playwright:**
    \`\`\`bash
    # Install NPM packages
    npm ci

    # Install Playwright browsers and dependencies
    npx playwright install --with-deps
    \`\`\`

3.  **Run your tests:**
    \`\`\`bash
    npx playwright test
    \`\`\`

### Workers

We recommend setting workers to "1" in CI environments to prioritize stability and reproducibility. Running tests sequentially ensures each test gets the full system resources, avoiding potential conflicts. However, if you have a powerful self-hosted CI system, you may enable parallel tests. For wider parallelization, consider sharding - distributing tests across multiple CI jobs.

**playwright.config.ts**
\`\`\`typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
});
\`\`\`

---

## CI Configurations

The Command line tools can be used to install all operating system dependencies in CI.

### GitHub Actions

**On push/pull_request**

Tests will run on push or pull request on branches main/master. The workflow will install all dependencies, install Playwright and then run the tests. It will also create the HTML report.

**.github/workflows/playwright.yml**
\`\`\`yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: !cancelled()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
\`\`\`

---

## Caching & Debugging

**Caching browsers**

Caching browser binaries is not recommended, since the amount of time it takes to restore the cache is comparable to the time it takes to download the binaries.

**Debugging browser launches**

Playwright supports the \`DEBUG\` environment variable to output debug logs. Setting it to \`pw:browser\` is helpful while debugging \`Error: Failed to launch browser\` errors.

\`\`\`bash
DEBUG=pw:browser npx playwright test
\`\`\`

**Running headed**

On Linux agents, headed execution requires Xvfb to be installed. To run browsers in headed mode with Xvfs, add \`xvfb-run\` before the actual command.

\`\`\`bash
xvfb-run npx playwright test
\`\`\`
`;
  return content;
};


const renderContent = (content: string) => {
    return content.split('```').map((part, index) => {
      if (index % 2 === 1) {
        const [lang, ...code] = part.split('\\n');
        return <CodeBlock key={index} code={code.join('\\n')} language={lang.trim()} className="my-4" />;
      }
      return part.split('\\n').map((line, lineIndex) => {
        if (line.startsWith('## ')) {
          return <h2 key={`${index}-${lineIndex}`} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b">{line.substring(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={`${index}-${lineIndex}`} className="text-xl font-semibold mt-6 mb-2">{line.substring(4)}</h3>
        }
         if (line.startsWith('**')) {
           const boldPart = line.match(/\*\*(.*?)\*\*/);
           const rest = line.replace(/\*\*(.*?)\*\*\\n/, '');
            return (
                <p key={`${index}-${lineIndex}`} className="mb-2 text-muted-foreground">
                    <strong className="text-foreground">{boldPart ? boldPart[1] : ''}</strong>
                    <br />
                    {rest}
                </p>
            );
        }
        if (line.trim() === '') return null;
        return <p key={`${index}-${lineIndex}`} className="mb-2 text-muted-foreground">{line}</p>
      });
    });
  }

export default function PlaywrightCiGuidePage() {
    const [guideContent, setGuideContent] = useState('');

    useEffect(() => {
        const loadContent = async () => {
            const content = await fetchGuideContent();
            setGuideContent(content);
        };
        loadContent();
    }, []);


  return (
    <div>
      <PageHeader
        title="Playwright CI/CD Guide"
        description="A comprehensive guide for setting up and running Playwright tests in various Continuous Integration (CI) environments."
      />
      <div className="space-y-8">
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Professional Workflow</AlertTitle>
            <AlertDescription>
                This guide shows the standard industry practice for running automated tests. The AI generates the code, and a CI/CD pipeline runs it.
            </AlertDescription>
        </Alert>

        <Card>
            <CardContent className="pt-6">
                {guideContent ? renderContent(guideContent) : <p>Loading guide...</p>}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
