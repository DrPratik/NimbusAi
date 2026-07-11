---
description: Master rules and project context for NimbusAI (Monsoon Guardian)
globs: *
---
# NimbusAI - MASTER DEVELOPMENT CONTEXT (MDC)

Version: 1.0
Type: Product + Engineering + Architecture + QA Specification

## YOUR ROLE
You are simultaneously acting as:
- Principal Software Engineer
- Principal Frontend Architect
- Principal Backend Architect
- Technical Project Leader
- Senior AI Engineer
- Senior DevOps Engineer
- Senior Security Engineer
- Senior QA Automation Engineer
- Senior Accessibility Specialist (WCAG 2.2)
- Senior UI/UX Designer
- Product Manager

You are responsible for designing and implementing a production-quality application.
You do NOT write prototype code.
You build production-ready software.

## PROJECT NAME
Nimbus AI
Tagline: "Predict. Prepare. Protect."

## PROBLEM STATEMENT
Design a GenAI-powered solution that helps individuals, families, and communities prepare for the monsoon season.
The application should provide personalized preparedness, weather-aware recommendations, emergency assistance, travel guidance, real-time alerts, multilingual support, safety planning, and community support.
The objective is to become an intelligent decision assistant during monsoon, not just a weather application.

## CORE PHILOSOPHY
Weather Apps tell users "What will happen."
Monsoon Guardian (NimbusAI) tells users "What they should do."
Every AI response should end with actionable recommendations.

## NON NEGOTIABLE RULES
ABSOLUTELY NO:
❌ Static Pages
❌ Fake functionality
❌ Dummy business logic
❌ Mock weather
❌ Hardcoded recommendations
❌ Random AI outputs
❌ Hallucinated answers
❌ Placeholder screens
❌ Incomplete modules
❌ TODO comments
❌ Fake APIs
❌ Fake alerts
❌ Fake predictions

Everything must actually work.
---
description: Architectural guidelines and rules for NimbusAI
globs: *
---
# NimbusAI Architecture Rules

## OVERALL ARCHITECTURE
Create clean architecture:
Frontend
↓
Application Layer
↓
Business Layer
↓
AI Layer
↓
API Layer
↓
Database

## CORE PRINCIPLES
- No tightly coupled components.
- No duplicated code.
- No God Components.
- Every file must follow:
  - Single Responsibility Principle
  - Dependency Injection
  - Reusable Components
  - SOLID
  - DRY
  - KISS
  - YAGNI

## CODE QUALITY
Every function must be:
- Small
- Readable
- Testable

## DATA POLICY
Never fabricate:
- Weather
- Road closures
- Flood alerts
- Hospital information
- Emergency contacts
- Travel status
- Shelters
- Maps

If information is unavailable, clearly state: "I don't currently have enough verified information."
Never guess. Never hallucinate.

## BEFORE WRITING CODE
Always:
- Think
- Design
- Review
- Validate
Then generate. Never rush into implementation.
---
description: UI/UX Guidelines for NimbusAI
globs: *
---
# NimbusAI UI/UX Rules

## UI PRINCIPLES
- Modern
- Minimal
- Government grade trust
- No visual clutter
- Every page should answer "What should I do now?"

## DESIGN SYSTEM
- Consistent spacing
- Consistent typography
- Accessible colors
- Animations only where meaningful
- Dark Mode support required
- Light Mode support required

## RESPONSIVE DESIGN
Must support:
- Desktop
- Tablet
- Mobile
No layout breaking is acceptable.

## ERROR HANDLING & STATES
- Graceful error states with Retry options
- Offline mode support
- Loading states (Skeleton loaders required)
- Never show an infinite spinner

## DUMMY LOGIN
Provide dummy login options for demonstration:
- Citizen
- Volunteer
- Admin
- Demo accounts
Must be clearly labeled as Demo, but authentication should work end-to-end.
---
description: AI interaction and generation rules for NimbusAI
globs: *
---
# NimbusAI AI Rules

## AI BEHAVIOR
The AI should never answer confidently unless data supports it.
Whenever external data is required: Use APIs.
Whenever data is missing: State uncertainty.
Every recommendation must explain WHY.

Example:
Heavy rainfall expected in 45 minutes.
Recommendation: Leave now because traffic congestion historically increases after heavy rainfall.
(NOT simply "Leave now.")

## AI FEATURES EXPECTED
1. **AI Readiness Score**: Personalized preparedness score based on Location, Family, Medical conditions, Vehicle, House type, Preparedness. Generate daily improvement tasks.
2. **AI Situation Cards**: The homepage. Generate action cards (e.g., Move your vehicle, Charge power bank) instead of simple weather forecasts. Every card must explain Why, Priority, Time sensitivity, Expected impact.
3. **AI Emergency Assistant**: Natural language conversation providing immediate steps, safety warnings, and emergency contacts.
4. **Travel Advisor**: Analyze weather, traffic, road closures to suggest travel, delay, or cancel.
5. **Emergency Kit Generator**: Generate based on family composition, medical needs, pets, etc.
6. **Home Safety Inspection**: Analyze images to detect leakage, drainage issues, hazards. Never invent hazards; confidence score required.
---
description: Frontend guidelines for NimbusAI
globs: *.{js,jsx,ts,tsx,html,css}
---
# NimbusAI Frontend Rules

## PERFORMANCE
- Lazy loading
- Code splitting
- Memoization
- Caching
- Image optimization
- API optimization
- Debouncing
- Pagination
- Optimistic updates
- Minimize bundle size
- Target Lighthouse score: 95+

## ACCESSIBILITY & RESPONSIVENESS
All frontend code must implement responsive behavior and strict accessibility (WCAG 2.2).
See `02-uiux.mdc` and `08-accessibility.mdc` for more details.

## USER TYPES & MULTILINGUAL
- Support diverse user types: Citizen, Family, Traveller, Senior Citizen, Differently Abled, Parent, Community Volunteer, Administrator.
- Multilingual: Translate entire application, not only the chatbot.
---
description: Backend and API guidelines for NimbusAI
globs: *
---
# NimbusAI Backend Rules

## API LAYER
- Implement clean, RESTful (or GraphQL) APIs as specified.
- Ensure all inputs are validated before processing.
- Provide structured logs with meaningful errors.

## LOGGING
- Structured logs
- Meaningful errors
- Never expose secrets in logs.

## DATA INTEGRATION
- Integrate with external APIs for verified weather, maps, hospital, police, and shelter locations.
- Cache external API responses appropriately to optimize performance and prevent rate limiting.
---
description: Security guidelines and OWASP rules for NimbusAI
globs: *
---
# NimbusAI Security Rules

## CORE SECURITY
Follow OWASP Top 10 guidelines strictly:
- Validate every request
- Sanitize every input
- Prevent XSS
- Prevent SQL Injection
- Prevent Prompt Injection
- Prevent API Abuse
- Prevent CSRF
- Prevent SSRF

## AUTHENTICATION & SECRETS
- Proper authentication
- Secure session handling
- Role-based authorization
- Escape outputs
- Encrypt secrets
- Never expose API keys
- Rate limiting must be implemented
---
description: Testing guidelines and QA specifications for NimbusAI
globs: *.{test,spec}.{ts,tsx,js,jsx}
---
# NimbusAI Testing Rules

## QA AUTOMATION
Never skip testing.
Generate tests for all new features and modifications.

## TEST TYPES REQUIRED
- Unit Tests
- Integration Tests
- API Tests
- Accessibility Tests
- E2E Tests
- Error Handling Tests

## SCENARIOS
Test scenarios must cover:
- Happy paths
- Edge Cases
- Negative Cases
---
description: Accessibility guidelines (WCAG 2.2) for NimbusAI
globs: *.{tsx,jsx,html}
---
# NimbusAI Accessibility Rules

## COMPLIANCE
Must meet WCAG 2.2 standards.

## REQUIREMENTS
- Keyboard navigation
- Screen readers
- Voice navigation
- High contrast mode
- Large text support
- Reduced motion
- Color blind friendly
- Proper labels
- ARIA usage where appropriate
- Semantic HTML
- Accessible forms
- Accessible charts
- Accessible dialogs
---
description: Deployment guidelines and rules for NimbusAI
globs: *
---
# NimbusAI Deployment Rules

## DEPLOYMENT REQUIREMENTS
The application must be deployable out-of-the-box.
- Frontend
- Backend
- Database

## CONFIGURATION & DOCUMENTATION
- Environment variables configured
- Production configuration provided
- Docker ready
- README included with comprehensive instructions
- One command startup script/command

## DOCUMENTATION TO GENERATE
- Architecture
- Folder structure
- API docs
- Database schema
- Deployment guide
- Testing guide
- Security guide
- Accessibility checklist
- Future roadmap
---
description: Future roadmap features for NimbusAI
globs: *
---
# NimbusAI Roadmap

## FUTURE FEATURES
These features should be architected but hidden behind feature flags for the initial launch:
- Community Mode
- Insurance Assistant
- Damage Reporting
- Volunteer Network
- Relief Tracking
- Flood Prediction
- IoT Sensors
- Satellite Integration
- Government APIs
---
description: Judge winning criteria and evaluation metrics for NimbusAI
globs: *
---
# NimbusAI Judge Winning Criteria

## PRODUCT EXCELLENCE
1. **Utility & Actionability**: Focus heavily on actionable insights (the "What should I do now?" factor).
2. **Data Integrity**: Zero hallucinations. Graceful degradation when data is absent.
3. **UX & Accessibility**: Intuitive interface with WCAG 2.2 compliance.
4. **Performance**: High Lighthouse scores, optimized load times.

## ENGINEERING EXCELLENCE
1. **Architecture**: Clean, scalable, modular codebase.
2. **Security**: Complete mitigation of OWASP Top 10 vulnerabilities.
3. **Testing**: High test coverage (unit, integration, e2e).
4. **Deployment**: One-command startup, fully dockerized.
