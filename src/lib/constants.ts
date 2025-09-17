export const n8nWorkflowJson = `{
  "nodes": [
    {
      "parameters": {},
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "typeVersion": 1,
      "position": [ 250, 300 ]
    },
    {
      "parameters": {
        "command": "firebase emulators:exec \\"npm run test:all\\""
      },
      "name": "Run Tests",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1,
      "position": [ 450, 300 ]
    },
    {
      "parameters": {
        "model": "openai-gpt-4",
        "prompt": "Summarize the following test results: {{ $json.stdout }}"
      },
      "name": "Summarize Results",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [ 650, 300 ]
    },
    {
      "parameters": {
        "text": "Test Summary: {{ $json.summary }}"
      },
      "name": "Notify Team",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [ 850, 300 ]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "{{ $json.exitCode }}",
              "operation": "equal",
              "value2": 0
            }
          ]
        }
      },
      "name": "If Tests Passed",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [ 1050, 300 ]
    },
    {
      "parameters": {
        "command": "firebase deploy --only hosting"
      },
      "name": "Deploy to Firebase",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1,
      "position": [ 1250, 200 ]
    }
  ],
  "connections": {
    "Start": {
      "main": [
        [
          {
            "node": "Run Tests",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Run Tests": {
      "main": [
        [
          {
            "node": "Summarize Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Summarize Results": {
      "main": [
        [
          {
            "node": "Notify Team",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Notify Team": {
      "main": [
        [
          {
            "node": "If Tests Passed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If Tests Passed": {
      "main": [
        [
          {
            "node": "Deploy to Firebase",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    }
  }
}`;

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
`;
