

export const githubActionsYaml = `name: Firebase CI/CD

on:
  push:
    branches:
      - main

jobs:
  test_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Run Emulator Tests
        run: firebase emulators:exec "npm run test:all"

      - name: Deploy to Firebase Hosting
        if: success()
        run: |
          firebase deploy --only hosting --token "$FIREBASE_TOKEN"
        env:
          FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}`;

export const docsContent = {
  setup: `### Local Setup Commands

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Start Firebase Emulator Suite:**
    This will start emulators for Auth, Firestore, and Functions.
    \`\`\`bash
    firebase emulators:start
    \`\`\`

3.  **Run Tests:**
    To run all tests against the emulators:
    \`\`\`bash
    firebase emulators:exec "npm run test:all"
    \`\`\`

    To run specific test suites:
    \`\`\`bash
    npm run test:jest # Unit tests
    npm run test:playwright # E2E tests
    \`\`\``,

  ciCd: `### CI/CD Setup Instructions

1.  **Generate Firebase Token:**
    Run this command locally and follow the instructions. This token is for deploying from a non-interactive environment like GitHub Actions.
    \`\`\`bash
    firebase login:ci
    \`\`\`

2.  **Add Secret to GitHub:**
    - Go to your GitHub repository's **Settings > Secrets and variables > Actions**.
    - Click **New repository secret**.
    - Name the secret \`FIREBASE_TOKEN\`.
    - Paste the token you generated in the previous step.

3.  **Commit the Workflow File:**
    - Ensure the \`.github/workflows/firebase-ci.yml\` file (as shown in the CI/CD Config tab) is committed to your repository.
    - Pushing to the \`main\` branch will now automatically trigger the workflow.`,

  debugging: `### Debugging Guide

-   **Failed Emulator Tests:**
    - Check the logs in your terminal where you ran \`firebase emulators:exec\`. The output will show which test failed and why.
    - For more detailed logs, open the Emulator UI at \`http://localhost:4000\` in your browser.

-   **Failed Deployments:**
    - Look at the GitHub Actions logs for the "Deploy to Firebase Hosting" step.
    - Common issues include an invalid or expired \`FIREBASE_TOKEN\`, or incorrect Firebase project configuration in \`.firebaserc\`.
    - To debug locally, try running \`firebase deploy --only hosting\` from your machine.`,
};

export const cicdIntegrationContent = {
  intro: `Next.js automatically creates an endpoint for each server action. You can call this endpoint from any script or command-line tool, like n8n's HTTP Request node.`,
  curl: `### Using cURL

You can use a simple cURL command to trigger the agent. This is useful for shell scripts in any CI/CD environment.

Replace \`YOUR_APP_URL\` with the deployed URL of this application, and ensure the \`Next-Action\` ID is up-to-date.

\`\`\`bash
curl -X POST YOUR_APP_URL/ai-agent \\
-H "Content-Type: application/json" \\
-H "Next-Action: 0113b2073981884633e3831385935f4922b9318c" \\
--data '[{"url":"https://www.google.com","task":"Search for cats and click the images tab"}]'
\`\`\`

**Important Notes:**
- The \`--data\` payload is a JSON array containing a single object with the \`url\` and \`task\` for the agent.`,
  node: `### Using a Node.js Script

For more complex integrations, you can use a Node.js script with \`node-fetch\`. This gives you more control over handling the response.

\`\`\`javascript
const fetch = require('node-fetch');

async function runAIAgent(appUrl, testUrl, testTask) {
  // WARNING: This ID can change between builds!
  const nextActionId = '0113b2073981884633e3831385935f4922b9318c'; 
  const endpoint = \`\${appUrl}/ai-agent\`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Next-Action': nextActionId,
      },
      body: JSON.stringify([{ url: testUrl, task: testTask }]),
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const resultText = await response.text();
    console.log('AI Agent Result:', resultText);

    // In a real pipeline, you would parse this result to determine
    // if the test passed or failed before proceeding.
    if (resultText.includes('summary')) {
        console.log('Test run completed successfully.');
        process.exit(0); // Success
    } else {
        console.error('Test run failed or did not return a summary.');
        process.exit(1); // Failure
    }

  } catch (error) {
    console.error('Error running AI Agent:', error);
    process.exit(1); // Failure
  }
}

// Example usage:
const appUrl = 'YOUR_APP_URL'; // e.g., https://your-app.apphosting.dev
const testUrl = 'https://www.google.com';
const testTask = 'Search for dogs and take a screenshot';

runAIAgent(appUrl, testUrl, testTask);
\`\`\`

This script can be added to your project and executed in a CI/CD job using \`node your-script-name.js\`.`,
};

export const technicalBlueprintContent = `# Studio AutoPilot - Technical Blueprint

This document outlines the technical architecture, stack, and key components of the Studio AutoPilot application.

## 1. Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
    *   **Why:** Enables a mix of Server-Side Rendering (SSR) and Server Components for performance, along with easy-to-use API routes and Server Actions for backend logic.
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
    *   **Why:** Provides type safety, better developer experience, and more maintainable code.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
    *   **Why:** A utility-first CSS framework for rapid UI development.
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
    *   **Why:** A collection of beautifully designed, accessible, and unstyled components that we can fully customize.
*   **AI/LLM Integration:** [Genkit (by Firebase)](https://firebase.google.com/docs/genkit)
    *   **Why:** A powerful open-source framework for building production-ready AI-powered features. It simplifies interactions with models like Gemini and allows for creating robust "flows" with tools.
*   **Backend & Auth:** [Firebase](https://firebase.google.com/)
    *   **Authentication:** Firebase Auth for secure user login and signup.
    *   **Database:** Firestore (for storing test results, templates, etc.).
    *   **Hosting:** Firebase Hosting.
*   **Browser Automation:** [Playwright](https://playwright.dev/)
    *   **Why:** Used by the AI Test Agent to control real browsers (Chromium, Firefox, WebKit) for E2E testing. It's robust, fast, and feature-rich.
*   **Visual Comparison:** [Pixel-diff libraries or AI Models]
    *   **Why:** For comparing screenshots and highlighting visual regressions.

## 2. Project Structure

\`\`\`
.
├── src/
│   ├── app/                    # Next.js App Router: All pages and layouts
│   │   ├── (protected)/        # Route group for pages that require auth
│   │   │   ├── ai-agent/
│   │   │   ├── dashboard/
│   │   │   └── ... (other pages)
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── ai/                     # All Genkit AI-related code
│   │   ├── flows/              # Genkit flows (e.g., exploreAndTestApp)
│   │   ├── schemas/            # Zod schemas for flow inputs/outputs
│   │   └── genkit.ts           # Genkit initialization
│   │
│   ├── components/             # Reusable React components
│   │   ├── layout/             # Layout components (Sidebar, AppShell)
│   │   ├── shared/             # Shared components (PageHeader, CodeBlock)
│   │   └── ui/                 # ShadCN UI components
│   │
│   ├── context/                # React Context providers
│   │   └── auth-context.tsx    # Manages user authentication state
│   │
│   ├── lib/                    # Helper functions, constants, Firebase config
│   │   ├── constants.ts
│   │   ├── firebase.ts
│   │   └── utils.ts
│   │
│   └── services/               # Services that interact with external tools
│       └── playwright.ts       # A singleton service to manage the Playwright browser instance
│
├── docs/                     # Project documentation
│   ├── APP_CONCEPT.md
│   └── TECHNICAL_BLUEPRINT.md
│   └── WORKFLOW.md
│
└── public/                   # Static assets
\`\`\`

## 3. Core Architectural Concepts

### Server Actions
We heavily use Next.js Server Actions to handle form submissions and AI flow invocations. This avoids the need to create separate API endpoints for every interaction. The front-end calls a server action, which then calls the appropriate Genkit flow.

### Genkit Flows & Tools
All AI logic is encapsulated within Genkit flows.
*   **Flows (\`ai/flows/*.ts\`):** A flow is a sequence of operations, often culminating in a call to an LLM. For example, \`exploreAndTestApp\` is a flow.
*   **Tools:** Within a flow, we define "tools" that the LLM can decide to use. For the AI Test Agent, tools include \`clickElement\`, \`fillInField\`, \`analyzeVisuals\`, and a \`findAlternativeSelector\` tool for self-healing. The LLM receives the state of the web page (via a screenshot) and decides which tool to use next to accomplish its task.

### Playwright Service (\`services/playwright.ts\`)
To prevent the AI agent from launching a new browser instance for every single action (which would be incredibly slow), we use a **singleton pattern**.
*   The \`PlaywrightService\` class ensures that only one browser instance is active at a time for a given user session.
*   It exposes simple methods like \`click(selector)\`, \`fill(selector, value)\`, and \`getPageAsDataUri()\`.
*   The Genkit tools for browser interaction call the methods on this singleton instance.
*   When the session is over, it closes the browser and returns a path to the recorded video.
*   This service will be extended to manage multiple browser types (Chrome, Firefox) for cross-browser testing.

### Authentication & Protected Routes
*   **\`auth-context.tsx\`:** A React Context wraps the entire application, providing user state (\`user\`, \`loading\`).
*   **\`app-shell-wrapper.tsx\`:** This component acts as a gatekeeper. It checks the user's auth state and the current URL.
    *   If a non-logged-in user tries to access a protected page (e.g., \`/dashboard\`), it redirects them to \`/login\`.
    *   If a logged-in user tries to access \`/login\` or \`/\`, it redirects them to \`/dashboard\`.
    *   It also determines whether to render the main \`AppShell\` (with sidebar) or just the page content (for public pages like landing, login).
`;
    

