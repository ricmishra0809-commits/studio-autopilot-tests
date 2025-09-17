# Studio AutoPilot - Technical Blueprint

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

```
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
```

## 3. Core Architectural Concepts

### Server Actions
We heavily use Next.js Server Actions to handle form submissions and AI flow invocations. This avoids the need to create separate API endpoints for every interaction. The front-end calls a server action, which then calls the appropriate Genkit flow.

### Genkit Flows & Tools
All AI logic is encapsulated within Genkit flows.
*   **Flows (`ai/flows/*.ts`):** A flow is a sequence of operations, often culminating in a call to an LLM. For example, `exploreAndTestApp` is a flow.
*   **Tools:** Within a flow, we define "tools" that the LLM can decide to use. For the AI Test Agent, tools include `clickElement`, `fillInField`, `analyzeVisuals`, and a `findAlternativeSelector` tool for self-healing. The LLM receives the state of the web page (via a screenshot) and decides which tool to use next to accomplish its task.

### Playwright Service (`services/playwright.ts`)
To prevent the AI agent from launching a new browser instance for every single action (which would be incredibly slow), we use a **singleton pattern**.
*   The `PlaywrightService` class ensures that only one browser instance is active at a time for a given user session.
*   It exposes simple methods like `click(selector)`, `fill(selector, value)`, and `getPageAsDataUri()`.
*   The Genkit tools for browser interaction call the methods on this singleton instance.
*   When the session is over, it closes the browser and returns a path to the recorded video.
*   This service will be extended to manage multiple browser types (Chrome, Firefox) for cross-browser testing.

### Authentication & Protected Routes
*   **`auth-context.tsx`:** A React Context wraps the entire application, providing user state (`user`, `loading`).
*   **`app-shell-wrapper.tsx`:** This component acts as a gatekeeper. It checks the user's auth state and the current URL.
    *   If a non-logged-in user tries to access a protected page (e.g., `/dashboard`), it redirects them to `/login`.
    *   If a logged-in user tries to access `/login` or `/`, it redirects them to `/dashboard`.
    *   It also determines whether to render the main `AppShell` (with sidebar) or just the page content (for public pages like landing, login).
