# Studio AutoPilot - Current Known Issues & Limitations

This document provides a transparent overview of the known issues and limitations in the current version of the application.

## 1. Core Problem: Server-Side Browser Automation is Not Supported

-   **Issue:** The biggest challenge is that the development and hosting environment for this application does not support running live browsers on the server. We cannot install the system-level dependencies required by tools like Playwright.
-   **Impact:** This is a **critical** issue that blocks our original vision of a fully autonomous AI agent that interacts with a live website on the backend.
-   **Consequence:** Any feature that relies on a server-side browser (like the original "AI Test Agent" or "Visual Recorder") will fail. We have had to pivot away from this approach.

---

## 2. Feature-Specific Issues

### "E2E Test Case Generator" is a Workaround, Not a Live Agent

-   **Limitation:** The current "E2E Test Case Generator" is a compromise. It **generates** test code but does not **run** the test itself.
-   **User Experience Gap:** The user must manually copy the generated Playwright code, paste it into their local development environment, and run it themselves. This is not the "hands-free" automated experience we originally envisioned.
-   **Current Status:** The generator works reliably, but it's a code generation tool, not a full testing and reporting solution.

### Dashboard is Underutilized

-   **Issue:** The main Dashboard is designed to show a history of test runs, including pass/fail status, video recordings, and detailed reports.
-   **Impact:** Since the live agent isn't running tests, the dashboard will always be empty or show "No test runs found." Its primary purpose is unfulfilled.

### CI/CD and Automation Docs are Outdated

-   **Issue:** The documentation pages for "n8n Workflow" and "CI/CD Integration" were written for the original, server-side AI agent.
-   **Impact:** The instructions provided there are no longer relevant. They describe how to trigger a server endpoint that no longer functions as described. This can be misleading for new users.

---

## Summary for the Product Manager

-   **What Works:** User authentication and all **text-based** AI tools (Strategy Generation, Script Generation, CI Summary, Security Rules) are stable and working as expected.
-   **What's Broken:** The core, "wow" feature of a live, autonomous testing agent is not functional due to environmental limitations.
-   **Next Steps (Recommendation):** We should focus on improving the "Test Case Generator" workflow. While we can't run the browser on the server, we can explore ways to make the process of using the generated code easier for the developer, potentially by providing better instructions or downloadable test file templates. We must also update all related documentation to reflect the current, code-generation-focused workflow.
