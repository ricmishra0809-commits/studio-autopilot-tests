# **App Name**: Firebase AutoPilot

## Core Features:

- Test Strategy Generation: Generates a comprehensive test strategy document tailored for Firebase projects, covering unit, integration, E2E, API, and security rules tests. It also recommends appropriate frameworks and outlines coverage goals.
- Automated Test Script Generation: Generates test scripts for various aspects of a Firebase project, including Jest unit tests for Firebase Functions, Firestore Security Rules tests, Playwright E2E tests for Auth flows (signup/login), and API tests for Cloud Function endpoints.
- No-Code Workflow Automation (n8n): Defines an n8n workflow that automates the testing and deployment process. This workflow includes a trigger (GitHub push or manual), an execution node to run tests using the Firebase emulator, an AI node to summarize test results, a Slack/Email node to send summary reports, and an IF node to conditionally deploy via Firebase CLI if tests pass.
- CI/CD Pipeline Configuration: Provides a CI/CD pipeline configuration (GitHub Actions YAML) as a backup mechanism. This pipeline runs emulator tests and deploys the application upon successful test completion.
- Automated Documentation & Runbook: Automatically generates documentation and a runbook that include local setup commands (emulator, jest, playwright), CI/CD setup instructions, and a debugging guide for failed tests or deployments.
- AI-Powered Test Enhancement: Leverages AI to enhance the testing process by auto-generating new test cases from Firestore schema and Functions code, summarizing CI results after each run, suggesting improvements to Security Rules, and detecting flaky tests for automatic retries, a tool to save engineering time.

## Style Guidelines:

- Primary color: Firebase orange (#FFCA28) to align with the Firebase brand and convey energy.
- Secondary color: Teal (#26A69A) to complement Firebase orange and add a sense of calmness and reliability.
- Background color: Off-white (#FAFAFA) to provide a clean and readable backdrop.
- Font: 'Roboto' for headings and body text to maintain readability and consistency with Google's Material Design.
- Code font: 'Fira Code' for displaying code snippets in a more readable and aesthetically pleasing manner.
- Use Material Design icons to match the overall aesthetic and provide clear visual cues.
- Subtle animations and transitions to provide feedback and enhance the user experience, such as loading spinners and success/failure indicators.