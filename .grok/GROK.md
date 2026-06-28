# Reverie — Grok Project Context

This file is the primary briefing for Grok when working in this repository.

**Read first:** [reverie/07_AGENT_ONBOARDING.md](./reverie/07_AGENT_ONBOARDING.md) for the full onboarding sequence.  
**Implementation reference:** [architecture.md](./architecture.md) for what is built today vs. what is planned.

## What is Reverie?

AI-first reflective companion for capturing thoughts, journaling experiences, building self-awareness, and receiving intelligent insights from personal history. Privacy-first; users own their data; the backend is the source of truth.

## Engineering Principles

1. **AI is async, explicit, and constrained** — no implicit context injection; AI runs in background workers, not inline with user requests.
2. **No implicit context or memory** — the app does not silently accumulate or inject context into conversations.
3. **User owns and controls data** — all memories are scoped to `userId`; auth is required for protected routes.
4. **Backend is source of truth** — the frontend consumes the REST API; business logic lives server-side.

## Repository Layout

```
Reverie/
├── backend/                 # Node.js + Express 5 + MongoDB (implemented)
│   ├── app.ts               # Express app factory (testable)
│   ├── index.ts             # Server entry (connect DB, listen)
│   ├── config/env.ts        # Typed environment config
│   ├── auth/                # JWT auth routes, model, middleware
│   ├── memory/              # Memory CRUD routes, controller, model
│   ├── insight/             # Insight routes, controller, model
│   ├── conversation/        # Conversation routes, controller, model
│   ├── services/            # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── memory.service.ts
│   │   ├── reflection.service.ts
│   │   ├── insight.service.ts
│   │   ├── conversation.service.ts
│   │   └── ai/              # ai.interface, ai.stub, factory
│   ├── middleware/          # error-handler, validate, rate-limit
│   ├── validators/          # Zod schemas per domain
│   ├── workers/             # reflection.worker.ts (async AI stub)
│   ├── utils/               # api-error, async-handler, relevance, refresh-token
│   └── tests/               # unit + integration
├── frontend/                # Next.js 16 scaffold (build via 08_FRONTEND_WORKFLOW.md)
└── .grok/                   # Grok project context (this folder)
    ├── reverie/             # Product vision, specs, roadmap (read in order 00–08 for UI)
    ├── architecture.md
    ├── config.toml          # Project MCP (Figma)
    ├── rules/
    └── skills/
```

## Documentation (`reverie/`)

Read these in order before contributing (see `07_AGENT_ONBOARDING.md`):

| # | File | Contents |
|---|------|----------|
| 00 | [00_PROJECT_OVERVIEW.md](./reverie/00_PROJECT_OVERVIEW.md) | Vision, principles, milestones |
| 01 | [01_PRODUCT_REQUIREMENTS.md](./reverie/01_PRODUCT_REQUIREMENTS.md) | Features: auth, journaling, memory, AI |
| 02 | [02_BACKEND_ARCHITECTURE.md](./reverie/02_BACKEND_ARCHITECTURE.md) | Target layer structure (routes → services → models) |
| 03 | [03_AUTH_SYSTEM_SPEC.md](./reverie/03_AUTH_SYSTEM_SPEC.md) | JWT + refresh token auth spec |
| 04 | [04_DATABASE_SCHEMA_ROADMAP.md](./reverie/04_DATABASE_SCHEMA_ROADMAP.md) | Phased schema: User → JournalEntry → Memory → Insight → Conversation |
| 05 | [05_AI_SYSTEM_DESIGN.md](./reverie/05_AI_SYSTEM_DESIGN.md) | Ingestion, reflection engine, retrieval, insights |
| 06 | [06_ENGINEERING_TODO.md](./reverie/06_ENGINEERING_TODO.md) | Completed phases and deferred work |
| 07 | [07_AGENT_ONBOARDING.md](./reverie/07_AGENT_ONBOARDING.md) | Agent onboarding guide |
| 08 | [08_FRONTEND_WORKFLOW.md](./reverie/08_FRONTEND_WORKFLOW.md) | Figma MCP → Next.js build workflow |
| — | [figma-links.md](./reverie/figma-links.md) | Figma frame URLs (fill before UI work) |

## Development Commands

### Backend

```bash
cd backend
cp .env.example .env   # set DATABASE_CONNECTION_STRING, JWT_SECRET
npm install
npm run dev            # API server on PORT (default 3000)
npm run worker         # reflection worker (stub)
npm run build && npm start
npm test               # Jest + Supertest + mongodb-memory-server
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # Next.js dev server (default 3001 if 3000 taken)
```

## Environment Variables

See `backend/.env.example` for the full list.

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_CONNECTION_STRING` | Yes | — | MongoDB connection URI |
| `JWT_SECRET` | Yes | — | JWT signing secret |
| `PORT` | No | `3000` | API port |
| `ACCESS_TOKEN_TTL` | No | `15m` | Access token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | No | `7` | Refresh token lifetime |
| `JWT_EXPIRES_IN` | No | `7d` | Legacy JWT expiry (see `auth/jwt.ts`) |
| `AI_PROVIDER` | No | `stub` | AI provider (`stub` today) |
| `REFLECTION_POLL_INTERVAL_MS` | No | `10000` | Worker poll interval |
| `REFLECTION_BATCH_SIZE` | No | `10` | Memories claimed per poll |
| `REFLECTION_MAX_ATTEMPTS` | No | `3` | Max reflection retries |
| `REFLECTION_STALE_PROCESSING_MS` | No | `300000` | Reclaim stuck `processing` docs |
| `REFLECTION_RETRY_BASE_MS` | No | `5000` | Retry backoff base |

## API Base Path

All API routes are versioned under `/api/v1/`. Auth uses raw JWT in the `Authorization` header (no `Bearer` prefix).

### Quick reference

- **Health:** `GET /health`
- **Auth:** `POST /auth/register`, `/login`, `/refresh`, `/logout`; `GET /auth/me`
- **Memories:** `POST /memories/create`, `GET /memories`, `/search`, `/relevant`, `/:id`, `PATCH /:id`, `DELETE /:id`
- **Insights:** `GET /insights`, `POST /insights/generate`, `GET /insights/:id`, `DELETE /insights/:id`
- **Conversations:** `POST /conversations`, `GET /conversations`, `GET /conversations/:id`, `POST /conversations/:id/messages`, `DELETE /conversations/:id`

## Frontend Status

The frontend is a Next.js 16 + React 19 scaffold (Pages Router). **Product UI is not built yet** — use [08_FRONTEND_WORKFLOW.md](./reverie/08_FRONTEND_WORKFLOW.md) with Figma MCP.

- Figma MCP: configured in `.grok/config.toml` (authenticate once via `/mcps` → figma)
- Frame links: fill in [figma-links.md](./reverie/figma-links.md) before screen work
- Slash command: `/frontend` loads the frontend build skill

## Spec vs. Implementation

The `reverie/` docs describe the **target** system. The backend is **largely implemented**; gaps are mostly AI quality, auth flows, and frontend.

| Area | Spec (`reverie/`) | Code today |
|------|-------------------|------------|
| Auth | Access + refresh tokens, `/me`, logout, password reset | Refresh rotation, `/me`, logout implemented; **password reset not built** |
| User model | `name`, `role`, `isVerified`, `refreshTokens` | `username` (not `name`), `email`, `role`, `isVerified`, `refreshTokens`, optional `profile` image |
| Data model | JournalEntry → Memory → Insight → Conversation (phased) | `Memory` is the journal write target; `Insight` and `Conversation` models exist; **no separate `JournalEntry`** |
| Architecture | routes → controllers → **services** → models | **Implemented** — services layer in `backend/services/` |
| AI / retrieval | Reflection engine, pattern detection, semantic search | Reflection worker + stub AI; insights and chat use stubs; `GET /memories/relevant` uses text/tag scoring only |
| Frontend | Product UI | Scaffold only |

See [architecture.md](./architecture.md) section 9 for the full gap analysis.

## When Working Here

1. Read `reverie/00` through `reverie/07` in order (start with `07_AGENT_ONBOARDING.md`).
2. Read `architecture.md` to understand what is actually built.
3. Follow conventions in `.grok/rules/conventions.md`.
4. Run `/reverie` for a guided project briefing.
5. Align new work toward the `reverie/` specs unless told otherwise.
6. Do not add implicit AI behavior to request handlers — use workers for async AI.

## Key Files

| File | Purpose |
|------|---------|
| `backend/app.ts` | Express app factory, route mounting, error handler |
| `backend/index.ts` | Mongo connection and server listen |
| `backend/auth/auth.model.ts` | User schema (refresh tokens, role, isVerified) |
| `backend/memory/memory.model.ts` | Memory schema (rich text, reflection, processing status) |
| `backend/insight/insight.model.ts` | Insight schema |
| `backend/conversation/conversation.model.ts` | Conversation + message history |
| `backend/auth/middleware.ts` | `requireAuth` and `authorize` guards |
| `backend/services/ai/index.ts` | AI provider factory (`AI_PROVIDER`) |
| `backend/workers/reflection.worker.ts` | Async reflection pipeline (stub) |
