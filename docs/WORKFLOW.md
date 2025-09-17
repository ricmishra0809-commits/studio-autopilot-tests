# Studio AutoPilot - End-to-End Workflow

This document describes the complete, automated workflow that Studio AutoPilot enables. The goal is to move from a code change to a production deployment with minimal human intervention.

The workflow can be implemented using the provided **n8n Workflow JSON** or the **GitHub Actions YAML config**.

---

### Step 1: Trigger (Code Push)

*   **Action:** A developer pushes a new commit to the `main` branch of the project's GitHub repository.
*   **Mechanism:** A webhook configured in the GitHub repository triggers the CI/CD pipeline (either n8n or GitHub Actions).

---

### Step 2: Execution (Run Automated Tests)

*   **Action:** The CI/CD server checks out the latest code and begins the testing process.
*   **Mechanism:**
    1.  It runs the command: `firebase emulators:exec "npm run test:all"`.
    2.  This command starts the local Firebase Emulator Suite (for Auth, Firestore, Functions).
    3.  It then executes all the test scripts defined in `package.json` (Jest unit tests, Playwright E2E tests, Firestore security rules tests).
    4.  The tests run against the local emulators, not live production data. This is crucial for a safe and isolated testing environment.
*   **Output:** The command outputs raw test results (pass/fail logs) to standard output (`stdout`) and returns an exit code (`0` for success, non-zero for failure).

---

### Step 3: Analysis (AI-Powered Summarization)

*   **Action:** The raw, often lengthy, test logs from the previous step are sent to an AI model for analysis.
*   **Mechanism:**
    1.  The CI/CD pipeline takes the `stdout` from the test execution step.
    2.  It calls the **Summarize CI Results** AI flow (`summarizeCIResults`).
    3.  The Genkit flow sends the logs to the Gemini LLM with a prompt asking it to provide a concise summary, identify which tests failed, and explain the potential reasons.
*   **Output:** A clean, human-readable JSON object containing the summary and details of the test run.

---

### Step 4: Notification (Report to Team)

*   **Action:** The AI-generated summary is sent to the development team.
*   **Mechanism:** The workflow integrates with a communication tool like Slack or an email service. It sends a message containing the test summary.
    *   **Example Message:** "✅ CI run #123 passed. All 52 tests successful." or "❌ CI run #124 failed. 2 tests failed in `auth.spec.ts`. See details..."
*   **Goal:** This keeps the entire team informed of the project's health without anyone needing to manually read through raw CI logs.

---

### Step 5: Conditional Logic (Check for Success)

*   **Action:** The workflow checks if all tests passed.
*   **Mechanism:** It inspects the exit code from **Step 2**. If the exit code is `0`, it proceeds. If it's anything else, the "success" path is skipped, and the workflow ends.

---

### Step 6: Deployment (Deploy to Production)

*   **Action:** If all tests passed, the new version of the application is deployed automatically.
*   **Mechanism:**
    1.  The workflow executes the command: `firebase deploy --only hosting`.
    2.  It uses a pre-configured `FIREBASE_TOKEN` (stored as a secret in the CI/CD environment) to authenticate with Firebase.
    3.  The latest build of the Next.js application is deployed to Firebase Hosting.
*   **Result:** The new code is live in production, fully tested and verified, completing the "hands-free" CI/CD loop.
