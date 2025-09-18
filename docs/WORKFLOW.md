# Studio AutoPilot - End-to-End Workflow

This document describes the complete, automated workflow that Studio AutoPilot enables. The goal is to move from a code change to a production deployment with minimal human intervention.

---

## n8n Manual Setup Guide

This is the recommended manual process for creating a reliable CI/CD pipeline in n8n.

### Step 1: Webhook Trigger
The workflow starts when it receives an HTTP request.
1.  **Add Node:** Start with a blank workflow and add a `Webhook` node.
2.  **Configuration:**
    *   This node will have a "Test URL". You will use this URL in your GitHub repository's webhook settings.
    *   The webhook should be configured to trigger on a `push` event to your `main` branch.

### Step 2: Execute Tests
This node runs all your automated tests in a safe, emulated environment.
1.  **Add Node:** Add an `Execute Command` node after the Webhook.
2.  **Configuration:**
    *   **Command:** `firebase emulators:exec "npm run test:all"`
    *   This command starts the Firebase emulators and runs the test script defined in your `package.json`.

### Step 3: Check for Success (IF Node)
This node checks if the tests passed or failed.
1.  **Add Node:** Add an `IF` node.
2.  **Configuration:**
    *   **Value 1:** Use the expression `{{ $json.exitCode }}`. This gets the exit code from the previous command. An exit code of `0` means success.
    *   **Operation:** `Equal`
    *   **Value 2:** `0`

### Step 4: Handle Failure (Slack Notification)
If the tests fail (the `IF` node's `false` output), a notification is sent.
1.  **Add Node:** From the `false` output of the `IF` node, add a `Slack` node.
2.  **Configuration:**
    *   **Credential:** Connect your Slack account. If you face issues, you may need to re-authenticate or create a new credential in n8n's "Credentials" section.
    *   **Action:** Select `Message` > `Post`.
    *   **Channel:** Choose your desired channel from the list (e.g., `engineering-product-launch`).
    *   **Message Text:** `❌ CI run failed! Check n8n logs for details.`

### Step 5: Handle Success (Deploy to Production)
If all tests pass (the `IF` node's `true` output), the application is deployed.
1.  **Add Node:** From the `true` output of the `IF` node, add another `Execute Command` node.
2.  **Configuration:**
    *   **Command:** `firebase deploy --only hosting --token "$FIREBASE_TOKEN"`
    *   **Important:** You must add your Firebase CI token as an environment variable in n8n or pass it securely to this command. The recommended way is using n8n's credential store.

---

The workflow can also be implemented using the provided **GitHub Actions YAML config**, which is often more reliable for code-based CI/CD.
