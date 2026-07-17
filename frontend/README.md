# SwarmGuard

SwarmGuard is a production-ready Next.js frontend for an Autonomous Workforce Operating System. The experience is intentionally designed as an AI-native command surface rather than a dashboard: users describe a project once, then watch SwarmGuard recruit, manage, evaluate, pay, learn, and self-heal AI workforces.

## Highlights

- Cinematic landing page with aurora gradients, glass surfaces, premium typography, and motion-rich storytelling
- Voice-first AI Command Console with microphone interaction, live transcription, file upload affordance, GitHub repository input, and instant workforce generation
- Workforce graph built with React Flow
- Live activity feed, vertical project timeline, evaluation engine, self-healing sequence, swarm memory panel, audit trail, and analytics charts
- Typed API service layer with mock mode and live backend mode
- TanStack Query, Zustand, React Hook Form, Framer Motion, Recharts, Tailwind CSS, and shadcn-style primitives
- Automated tests that run with `npm test` and require no API keys

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion
- shadcn-style component primitives
- Lucide Icons
- React Hook Form
- Speech Recognition API
- React Flow
- Recharts
- TanStack Query
- Zustand
- ESLint + Prettier
- Vitest + Testing Library

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

### 3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev        # Start local development server
npm run build      # Create production build
npm run start      # Run built application
npm run lint       # Run ESLint
npm run typecheck  # Validate TypeScript
npm run test       # Run automated tests
npm run format     # Check Prettier formatting
```

## Production build

```bash
npm run build
npm run start
```

## Deployment

This app deploys cleanly to Vercel or any Node-compatible platform that supports Next.js App Router.

Typical production settings:

- `NEXT_PUBLIC_API_MODE=live`
- `NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com/api`
- `NEXT_PUBLIC_AUTH_MODE=jwt`
- `NEXT_PUBLIC_WS_URL=wss://your-backend.example.com/ws`

## Folder structure

```text
src/
  app/
    error.tsx
    globals.css
    layout.tsx
    not-found.tsx
    page.tsx
  components/
    core/
      analytics-panel.tsx
      audit-trail.tsx
      aurora-background.tsx
      command-console.tsx
      evaluation-engine.tsx
      footer.tsx
      hero.tsx
      live-activity-feed.tsx
      project-timeline.tsx
      scroll-story.tsx
      section-shell.tsx
      self-healing-panel.tsx
      summary-cards.tsx
      swarm-memory-panel.tsx
      swarmguard-shell.tsx
      workforce-graph.tsx
    ui/
      badge.tsx
      button.tsx
      card.tsx
      input.tsx
      textarea.tsx
  config/
    env.ts
  hooks/
    use-command-console.ts
  lib/
    api/
      client.ts
      swarmguard.ts
      swarmguard.test.ts
    format.ts
    mock-data.ts
    providers.tsx
    query-client.ts
    types.ts
    utils.ts
  store/
    ui-store.ts
  test/
    setup.ts
```

## Architecture overview

### App shell

`src/app/page.tsx` renders `SwarmguardShell`, which assembles the entire operating-system-like experience into a single responsive page.

### Feature-first composition

Each major product story section lives in `src/components/core`. UI primitives live in `src/components/ui` and follow shadcn conventions.

### State and data

- TanStack Query handles async server state
- Zustand is available for lightweight UI state
- React Hook Form powers the command console
- Motion and reduced-motion support are built into the visual system

### API abstraction layer

The frontend never talks to backend endpoints directly from components. All integrations route through:

- `src/lib/api/client.ts`
- `src/lib/api/swarmguard.ts`
- `src/config/env.ts`

This keeps mock mode and live mode identical from the component perspective.

## Backend integration guide

### Files to modify

1. `src/config/env.ts`
   - Update environment variable defaults only if your platform requires different local values.

2. `src/lib/api/client.ts`
   - Keep the `request()` transport as the central HTTP client.
   - Keep `connectActivityStream()` as the single streaming gateway.

3. `src/lib/api/swarmguard.ts`
   - Map your real backend routes and typed request/response contracts here.

4. `src/lib/types.ts`
   - Replace or extend the TypeScript interfaces to match real payloads.

### Expected request and response shapes

#### Analyze command

Current frontend call:

```ts
swarmguardApi.analyzeCommand({
  command: string,
  source: "voice" | "text"
})
```

Current expected response:

```ts
{
  transcript: string;
  summaryCards: ProjectSummaryCard[];
  recommendedWorkforce: AgentNode[];
  reasoning: CommandPhase[];
  riskHeadline: string;
}
```

#### Snapshot bootstrap

Current frontend call:

```ts
swarmguardApi.getSnapshot()
```

Current expected response:

```ts
{
  summaryCards: ProjectSummaryCard[];
  agents: AgentNode[];
  activity: ActivityItem[];
  timeline: TimelineEvent[];
  evaluationSignals: EvaluationSignal[];
  auditTrail: AuditRecord[];
  memory: MemoryInsight[];
  metrics: MetricCard[];
  chartData: ChartPoint[];
  commandExample: string;
}
```

### Authentication flow

The transport is ready for cookie-based or JWT-based auth.

- `NEXT_PUBLIC_AUTH_MODE=demo` keeps the app frictionless in mock mode
- `NEXT_PUBLIC_AUTH_MODE=jwt` is the intended live mode switch
- `src/lib/api/client.ts` already sends `credentials: "include"`

If your backend uses bearer tokens, add a token accessor in `request()`:

```ts
headers: {
  Authorization: `Bearer ${token}`,
}
```

Because all requests already go through the central client, you do not need to restructure any page or component to add auth.

### Streaming / WebSocket integration

The live activity feed uses `swarmguardApi.connectActivityStream()`.

Mock mode:
- emits timed local messages to simulate an active swarm

Live mode:
- opens a WebSocket using `NEXT_PUBLIC_WS_URL`

If your backend uses Server-Sent Events instead, replace the WebSocket implementation in `connectActivityStream()` with an `EventSource` while keeping the same component API.

### Mock mode to live mode migration

No structural changes are required.

1. Set `NEXT_PUBLIC_API_MODE=live`
2. Point `NEXT_PUBLIC_API_BASE_URL` to your Python backend
3. Point `NEXT_PUBLIC_WS_URL` to your streaming endpoint
4. Align the interfaces in `src/lib/types.ts`
5. Replace mock payload assumptions in `src/lib/api/swarmguard.ts`

The UI components will continue to work unchanged because they depend only on typed service outputs.

## API endpoint examples

Suggested Python backend routes:

```text
GET  /api/snapshot
POST /api/command/analyze
GET  /api/projects/:id/timeline
GET  /api/projects/:id/audit
WS   /ws
```

## Accessibility

The interface includes:

- semantic sections and headings
- visible focus states
- keyboard-accessible controls
- ARIA labels for command interactions
- reduced-motion support
- strong color contrast across dark surfaces

## Testing

Run:

```bash
npm test
```

Test coverage includes:

- service-layer mock integration
- command console interaction flow
- timeline expansion behavior
- audit trail expansion behavior

## Advisory-only disclaimer

SwarmGuard is a frontend demonstration and orchestration surface. Any budget decisions, payment releases, security evaluations, or workforce recommendations shown in mock mode are illustrative until connected to your real backend logic, policy engine, and authorization model.
