# Reverie — System Architecture

> Last updated: 2026-06-28  
> This document describes **what is implemented in code today**.

## 1. Overview

Reverie is an AI-first reflective companion. Users write journal entries stored as **memories**. AI processing runs **asynchronously** in a background worker — never inline in HTTP handlers. Chat and insights use stub AI today; the provider is swappable via `AI_PROVIDER`.

## 2. Technology Stack

| Layer | Technology | Status |
|-------|------------|--------|
| API | Node.js + Express 5 | Implemented |
| Language | TypeScript 5.9 | Implemented |
| Database | MongoDB + Mongoose 9 | Implemented |
| Auth | JWT access + refresh tokens, bcrypt | Implemented |
| Validation | Zod | Implemented |
| Tests | Jest + Supertest + mongodb-memory-server | Implemented |
| AI | Stub service (`services/ai/`) | Implemented (stub) |
| Worker | Reflection polling worker | Implemented |
| Frontend | Next.js 16 + React 19 scaffold | Not started |

## 3. Backend Structure

```
backend/
├── app.ts                     # Express app factory (testable)
├── index.ts                   # Server entry (connect DB, listen)
├── config/env.ts
├── middleware/                # error-handler, validate, rate-limit
├── validators/                # Zod schemas per domain
├── services/                  # Business logic
│   ├── auth.service.ts
│   ├── memory.service.ts
│   ├── reflection.service.ts
│   ├── insight.service.ts
│   ├── conversation.service.ts
│   └── ai/                    # ai.interface, ai.stub, index (factory)
├── auth/                      # routes, controller, model, jwt, middleware
├── memory/                    # routes, controller, model
├── insight/                   # routes, controller, model
├── conversation/              # routes, controller, model
├── workers/reflection.worker.ts
├── utils/                     # api-error, async-handler, relevance, refresh-token
└── tests/                     # unit + integration
```

Pattern: **routes → controllers → services → models**

## 4. Data Models

### User (`auth/auth.model.ts`)

- `email`, `username`, `passwordHash`
- `role`: `"user"` | `"admin"` (default `"user"`)
- `isVerified`: boolean (default `false`; no verification flow yet)
- `refreshTokens`: hashed entries with expiry
- Optional `profile` image (`data` Buffer + `contentType`)

### Memory (`memory/memory.model.ts`)

Journal entries with inline reflection fields:

- `richTextContent`, optional `title`, `mood`, `tags`, `location`, `important`
- `processingStatus`: `pending` | `processing` | `done` | `failed`
- `reflection` subdoc: `summary`, `emotions`, `themes`, `processedAt`, `version`
- `embeddingId` (stub-populated)
- Text index on `title` + `richTextContent`

### Insight (`insight/insight.model.ts`)

- `title`, `content`, `sourceMemoryIds`, `generatedAt`

### Conversation (`conversation/conversation.model.ts`)

- `title`, `messages[]` (`role`, `content`, `createdAt`)
- `metadata`: optional `relatedMemoryIds`, `insightIds`

## 5. API Reference

Base: `http://localhost:3000/api/v1`  
Auth header: raw JWT in `Authorization` (no `Bearer` prefix)

### Health
- `GET /health` → `{ ok: true }`

### Auth `/auth`
| Method | Path | Response |
|--------|------|----------|
| POST | `/register` | `{ accessToken, refreshToken }` |
| POST | `/login` | `{ accessToken, refreshToken }` |
| POST | `/refresh` | `{ accessToken, refreshToken }` (rotates) |
| POST | `/logout` | `{ success: true }` |
| GET | `/me` | User profile |

### Memories `/memories`
| Method | Path | Notes |
|--------|------|-------|
| POST | `/create` | title, richTextContent, mood, tags, location, important |
| GET | `/` | Paginated; filter by mood, tags, important |
| GET | `/search?query=` | MongoDB full-text search |
| GET | `/relevant?query=` | Stub scored retrieval (text/tag matching) |
| GET | `/:id` | Single memory |
| PATCH | `/:id` | Content change clears reflection |
| DELETE | `/:id` | |

### Insights `/insights`
| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | List insights |
| POST | `/generate` | Stub weekly insight from recent memories |
| GET | `/:id` | |
| DELETE | `/:id` | |

### Conversations `/conversations`
| Method | Path | Notes |
|--------|------|-------|
| POST | `/` | Start chat |
| GET | `/` | List chats |
| GET | `/:id` | Full thread |
| POST | `/:id/messages` | User message + stub assistant reply |
| DELETE | `/:id` | |

## 6. Reflection Worker

Run: `cd backend && npm run worker`

- Polls every `REFLECTION_POLL_INTERVAL_MS` (default 10s)
- Claims pending memories atomically (`processingStatus` lifecycle)
- Writes `reflection` subdoc + `embeddingId` via stub AI
- Retries failed memories with backoff; reclaims stale `processing` docs

## 7. AI Service

Factory: `services/ai/index.ts` — selects provider via `AI_PROVIDER` (default `stub`).

Stub capabilities (`services/ai/ai.stub.ts`):

- `generateReflection` — summary, emotions, themes from memory content
- `generateInsight` — weekly insight from memory batch
- `generateChatReply` — assistant reply for conversations
- `generateEmbeddingId` — deterministic placeholder ID

Inline AI in HTTP handlers is limited to stub chat/insight generation in their respective services; memory reflection is worker-only.

## 8. Testing

```bash
cd backend && npm test
```

- In-memory MongoDB per test run
- 8 suites, 10 tests (unit + integration + worker smoke)
- Covers: auth, memory, insights, conversations, reflection worker, relevance scoring, stub AI, memory invalidation

## 9. Spec vs. Implementation Gaps

| Area | Spec target | Current state |
|------|-------------|---------------|
| User `name` field | `name` | Uses `username` instead |
| JournalEntry model | Separate collection | `Memory` is the journal write target |
| Password reset | Full flow | Not built |
| Email verification | Verification flow | `isVerified` field only; no flow |
| Real LLM / embeddings | Production AI | Stub only; swap via `services/ai/` |
| Vector semantic search | Embedding-based retrieval | Text/tag scoring stub |
| Scheduled insights | Cron/queue generation | On-demand `POST /insights/generate` only |
| Frontend | Product UI | Next.js 16 scaffold only |
| Production deploy | Configured deployment | Not configured |

## 10. Environment Variables

See `backend/.env.example` for full list. Key vars:

- `DATABASE_CONNECTION_STRING`
- `JWT_SECRET`
- `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL_DAYS`
- `AI_PROVIDER=stub`
- `REFLECTION_POLL_INTERVAL_MS`, `REFLECTION_BATCH_SIZE`
- `REFLECTION_MAX_ATTEMPTS`, `REFLECTION_STALE_PROCESSING_MS`, `REFLECTION_RETRY_BASE_MS`
