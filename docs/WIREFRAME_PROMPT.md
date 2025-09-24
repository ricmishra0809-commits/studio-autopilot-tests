# Prompt for Wireframing: Studio AutoPilot

## 1. Project Overview

You are tasked with creating a set of wireframes for "Studio AutoPilot," an AI-powered copilot designed to automate software testing and deployment, especially for Firebase projects.

**Core Goal:** To create an intuitive, clean, and developer-focused interface that makes complex automation tasks feel simple and manageable.

**Brand Feel:** Professional, intelligent, modern, and reliable. It should feel like a trusted partner in the development process.

**Style Guidelines:**
*   **Primary Color:** Firebase Orange (`#FFCA28`) - for main actions, highlights, and important elements.
*   **Secondary Color:** Teal (`#26A69A`) - for secondary buttons, highlights, and success states.
*   **Background:** Off-white (`#FAFAFA`) for light mode, and a dark grey (`#1A1A1A` or similar) for dark mode.
*   **Fonts:** "Roboto" for all text, and "Fira Code" for any code snippets or technical outputs.
*   **Icons:** Use Material Design icons (or a similar clean, modern set like Lucide).
*   **Layout:** Use cards, clear headings, and generous spacing. The layout should be responsive and work seamlessly on both desktop and mobile.

---

## 2. Key Pages to Wireframe

Please create wireframes for the following key pages of the application.

### Page 1: Dashboard (The Main Hub)
This is the first screen a user sees after logging in. It should provide a quick, actionable summary of their testing status.

*   **Header:** Show the app name "Studio AutoPilot" and a user profile icon.
*   **Key Metrics:** Display three prominent cards at the top for:
    1.  **Total Runs:** Total number of tests executed.
    2.  **Pass Rate:** Percentage of successful tests (e.g., 95.8%).
    3.  **Failures:** Number of failed tests.
*   **Analytics Chart:** A bar chart visualizing "Passed vs. Failed" test runs.
*   **Quick Links:** A section with large, clear buttons for the most common actions:
    *   "Run New AI Test" (Primary Action)
    *   "Generate Test Strategy"
    *   "Generate Test Scripts"
*   **Recent Test Runs Table:** A table showing the last 5-10 test runs with columns for:
    *   **Status:** A badge (e.g., "Pass" in green/teal, "Fail" in red).
    *   **Task:** The description of the test that was run.
    *   **URL:** The target URL of the test.
    *   **Ran At:** Timestamp.
    *   **Actions:** A "View Report" button.

### Page 2: AI Test Agent (The Core Feature)
This page is where the user deploys the autonomous testing agent.

*   **Inputs Section:**
    *   A large input field for the "Application URL".
    *   A dropdown to select a "Device" for emulation (e.g., "Desktop", "iPhone 13", "Pixel 5").
    *   A large textarea for the "Task to Perform" where the user writes their instructions in plain English.
    *   A prominent "Run AI Agent" button.
*   **Loading State:** After clicking "Run", the form should be disabled, and a clear loading state should appear, indicating that the "Agent is exploring the application...".
*   **Results View (appears after completion):**
    *   **Summary:** A card displaying the AI-generated text summary of the test session.
    *   **Session Recording:** A large video player to show the screen recording of the test.
    *   **Agent Steps:** A step-by-step breakdown of the agent's actions. Each step should be a card containing:
        *   The observation or thought process of the AI.
        *   The action taken (e.g., `click(button.primary)`).
        *   A screenshot of the page at that moment.

### Page 3: Generate Test Scripts
This page allows the user to get boilerplate test code from the AI.

*   **Input Form:** A single, large textarea where the user can paste all their project details (schema, function code, etc.).
*   **Output Section:** After generation, display the results in a tabbed view or separate cards:
    *   **Jest Unit Tests:** A code block with the generated Jest tests.
    *   **Firestore Rules Tests:** A code block.
    *   **Playwright E2E Tests:** A code block.
    *   **API Tests:** A code block.
    *   Each code block should have a "Copy" button.

### Page 4: CI/CD & Automation Pages
This section covers how users integrate the tool into their workflow.

*   **n8n Workflow:** A visual, step-by-step guide showing how to build the workflow in n8n. Use images and short descriptions for each step (e.g., "Step 1: Add Webhook", "Step 2: Execute Command").
*   **CI/CD Config:** A simple page that displays a single, large code block containing the `github-actions.yml` configuration, with a "Copy" button.
*   **Runbook/Docs:** A page with clear documentation, broken into sections like "Local Setup", "CI/CD Setup", and "Debugging". Use code blocks for commands.

---

## 3. General UI/UX Considerations

*   **Clarity is Key:** The user should always know what's happening, especially during long-running AI tasks. Use loading spinners, progress indicators, and clear text.
*   **Feedback:** Provide immediate feedback for actions. Use toast notifications for errors or success confirmations.
*   **Empty States:** Design clean empty states for the dashboard and test run tables (e.g., "No test runs yet. Run your first AI agent to get started!").
*   **Navigation:** A simple sidebar or header navigation should provide easy access to all the main pages (Dashboard, AI Agent, Generate, Automation, etc.).
