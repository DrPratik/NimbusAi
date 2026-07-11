# NimbusAI Development Task Plan

- `[x]` **Phase 0: Configuration & Environment**
  - `[x]` Migrate MDC rules to `.agents/AGENTS.md` for Antigravity native support.
  - `[x]` Scaffold Next.js application in the root directory (TypeScript, App Router, No Tailwind).
  - `[x]` Setup `.env.local` for API Keys (Gemini 3.1 Flash-Lite) and Database.

- `[x]` **Phase 1: Foundation & Architecture**
  - `[x]` Initialize Prisma ORM with SQLite (for initial development, easily swappable to PostgreSQL).
  - `[x]` Design database schema (User, ReadinessScore, EmergencyContact).
  - `[/]` Implement robust API error handling and logging utilities.
  - `[x]` Setup Base UI System in `globals.css` (variables for colors, typography, modern aesthetic, dark/light mode).
  - `[x]` Create core atomic components (`Button`, `Card`, `Input`, `Dialog`, `Skeleton`).

- `[/]` **Phase 2: Core AI Services Integration**
  - `[x]` Create `src/lib/gemini.ts` to interface securely with the Gemini API.
  - `[ ]` Implement `PromptEngine` for generating contextual, data-driven prompts (preventing hallucinations).

- `[/]` **Phase 3: Core Features (Iterative Implementation)**
  - `[x]` **Feature 1: AI Readiness Score** (Personalized score, location/family based, daily tasks)
  - `[x]` **Feature 2: AI Situation Cards** (Homepage action cards, prioritizing actions over forecasts)
  - `[x]` **Feature 3: AI Emergency Assistant** (Natural language Chatbot for immediate steps & warnings)
  - `[/]` **Feature 4: Travel Advisor** (Weather & traffic analysis for travel recommendations)
  - `[ ]` **Feature 5: Emergency Kit Generator** (Dynamic generation based on family comp/medical)
  - `[ ]` **Feature 6: Home Safety Inspection** (Vision AI to analyze uploaded images for hazards)
  - `[ ]` **Feature 7: Nearby Emergency Services** (Maps integration for hospitals, police, shelters)
  - `[ ]` **Feature 8: Multilingual Support** (App-wide translation, not just the chatbot)
  - `[ ]` **Feature 9: Family Safety Dashboard** (Member status tracking, emergency contacts)
  - `[ ]` **Feature 10: Preparedness Planner** (Daily checklist with auto-reprioritization)
  
- `[ ]` **Phase 4: Polish & Testing**
  - `[ ]` Setup Jest/React Testing Library and add basic component tests.
  - `[ ]` Accessibility (WCAG 2.2) audit using `axe-core`.
  - `[ ]` Responsive design verification.
  - `[ ]` Dockerize the application.
