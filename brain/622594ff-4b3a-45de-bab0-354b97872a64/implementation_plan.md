# NimbusAI Implementation Plan

This document outlines the initial plan to bootstrap and build the NimbusAI application according to the Master Development Context (MDC) guidelines.

## User Review Required
> [!IMPORTANT]
> - **Framework Choice:** I propose using **Next.js (App Router)** as the framework for this application. It provides excellent performance, built-in API routes (perfect for our AI backend), and strong SEO/accessibility foundations.
> - **Styling:** As per my core guidelines, I will use **Vanilla CSS** (via CSS Modules in Next.js) to build a premium, highly customized UI rather than relying on utility frameworks like Tailwind, ensuring complete control over the design system.
> - **Antigravity Customization:** I will migrate the rules from `.cursor/rules/` to `.agents/AGENTS.md` so that my system automatically enforces them in every future task.

## Open Questions
> [!WARNING]
> 1. **Project Directory:** Should I initialize the Next.js project directly in the root directory (`/Users/pratikdhore/Documents/Projects/NimbusAI`), or in a specific subfolder (e.g., `client/` and `server/` separately)? Next.js can handle both frontend and backend APIs in a single monolithic repo, which fits our needs nicely.
> 2. **Database:** What database would you prefer for storing user data, emergency contacts, and readiness scores? (e.g., PostgreSQL via Prisma, MongoDB, or Firebase?)

## Proposed Changes

### Configuration
#### [NEW] [AGENTS.md](file:///Users/pratikdhore/Documents/Projects/NimbusAI/.agents/AGENTS.md)
Will contain the compiled MDC rules so I automatically enforce them.
#### [DELETE] [.cursor/rules/](file:///Users/pratikdhore/Documents/Projects/NimbusAI/.cursor/rules)
We will clean up the cursor-specific folder.

### Project Setup
- Run `npx create-next-app` to scaffold a Next.js App Router project in the root (without Tailwind, using TypeScript and standard CSS).
- Create `.env.local` to store the Gemini API Key.
- Setup `src/styles/globals.css` with a robust, modern design system (variables for colors, spacing, typography, dark/light mode).

### Core Components Scaffold
- `src/components/ui/` - Foundational accessible components (Button, Card, Dialog, Skeleton)
- `src/app/page.tsx` - The main dashboard for AI Situation Cards
- `src/app/api/ai/route.ts` - The centralized AI service interacting with Gemini 3.1 Flash-Lite.

## Verification Plan

### Automated Tests
- We will set up `Jest` and `React Testing Library` for unit testing the UI components.
- We will set up `Playwright` or `Cypress` for E2E testing core user flows.

### Manual Verification
- Start the development server (`npm run dev`) to verify the responsive dashboard, light/dark mode toggling, and initial AI API integration.
