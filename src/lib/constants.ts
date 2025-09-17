
export const n8nWorkflowJson = `{
  "name": "Studio AutoPilot CI/CD Pipeline",
  "nodes": [
    {
      "parameters": {
        "path": "a1b2c3d4e5",
        "options": {}
      },
      "id": "1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [
        -180,
        320
      ],
      "webhookId": "a1b2c3d4-e5f6-7890-1234-abcdef123456"
    },
    {
      "parameters": {
        "command": "firebase emulators:exec \\"npm run test:all\\"",
        "options": {
          "continueOnFail": true
        }
      },
      "id": "2",
      "name": "Run All Tests",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 2,
      "position": [
        40,
        320
      ]
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "{{$json.exitCode}}",
              "operation": "equal",
              "value2": 0
            }
          ]
        },
        "options": {}
      },
      "id": "3",
      "name": "Did Tests Pass?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        260,
        320
      ]
    },
    {
      "parameters": {
        "authentication": "openApi",
        "nodeUrl": "https://openrouter.ai/api/v1",
        "model": "google/gemini-flash-1.5",
        "prompt": "The following CI/CD test run failed. Please analyze the output and provide a very short, one-paragraph summary explaining what went wrong and which tests failed. Be concise. Test output:\\n\\n{{$json[\\"stdout\\"]}}\\n\\n{{$json[\\"stderr\\"]}}",
        "options": {}
      },
      "id": "4",
      "name": "Summarize Failure with AI",
      "type": "n8n-nodes-base.openAiChat",
      "typeVersion": 2.1,
      "position": [
        500,
        500
      ],
      "credentials": {
        "openApi": {
          "id": "YOUR_OPENROUTER_CREDENTIALS_ID",
          "name": "OpenRouter"
        }
      }
    },
    {
      "parameters": {
        "command": "firebase deploy --only hosting --token YOUR_FIREBASE_TOKEN",
        "options": {}
      },
      "id": "5",
      "name": "Deploy to Firebase",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 2,
      "position": [
        500,
        180
      ]
    },
    {
      "parameters": {
        "text": "✅ CI run passed! Deploying new version to production.",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "✅ *CI Run Passed!*\\nDeploying new version to production."
            }
          }
        ]
      },
      "id": "6",
      "name": "Notify Success on Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 3,
      "position": [
        720,
        180
      ],
      "credentials": {
        "slackApi": {
          "id": "YOUR_SLACK_CREDENTIALS_ID",
          "name": "Slack account"
        }
      }
    },
    {
      "parameters": {
        "text": "❌ CI run failed! Reason: {{$json.choices[0].message.content}}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "❌ *CI Run Failed!*\\n*AI Summary:* {{$json.choices[0].message.content}}"
            }
          }
        ]
      },
      "id": "7",
      "name": "Notify Failure on Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 3,
      "position": [
        720,
        500
      ],
      "credentials": {
        "slackApi": {
          "id": "YOUR_SLACK_CREDENTIALS_ID",
          "name": "Slack account"
        }
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Run All Tests",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Run All Tests": {
      "main": [
        [
          {
            "node": "Did Tests Pass?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Did Tests Pass?": {
      "main": [
        [
          {
            "node": "Deploy to Firebase",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Summarize Failure with AI",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Summarize Failure with AI": {
      "main": [
        [
          {
            "node": "Notify Failure on Slack",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Deploy to Firebase": {
      "main": [
        [
          {
            "node": "Notify Success on Slack",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "pinData": {},
  "versionId": "1.0",
  "triggerCount": 1,
  "tags": [
    "firebase",
    "ci/cd",
    "ai",
    "automation"
  ]
}
`;

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

    