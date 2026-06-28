---
name: reverie
description: >
  Work on the Reverie journaling app. Use when the user asks about Reverie
  architecture, backend API, memory/auth modules, reflection worker, or runs
  /reverie. Loads project context and architecture before making changes.
metadata:
  short-description: "Reverie project context and architecture"
---

# Reverie Skill

You are working on **Reverie**, a private AI-assisted journaling app.

## Before Making Changes

Read project docs in this order (from `07_AGENT_ONBOARDING.md`):

1. `.grok/reverie/00_PROJECT_OVERVIEW.md`
2. `.grok/reverie/01_PRODUCT_REQUIREMENTS.md`
3. `.grok/reverie/02_BACKEND_ARCHITECTURE.md`
4. `.grok/reverie/03_AUTH_SYSTEM_SPEC.md`
5. `.grok/reverie/04_DATABASE_SCHEMA_ROADMAP.md`
6. `.grok/reverie/05_AI_SYSTEM_DESIGN.md`
7. `.grok/reverie/06_ENGINEERING_TODO.md`
8. `.grok/architecture.md` — **what is actually implemented today** (spec vs. code gaps)
9. `.grok/GROK.md` — commands, env vars, quick reference
10. `.grok/rules/conventions.md` — coding standards

## Key Constraints

- **Backend is source of truth** — business logic stays server-side.
- **AI is async only** — never add inline AI calls to HTTP handlers; use `workers/`.
- **User data isolation** — all memory queries must scope to `req.userId`.
- **Frontend is not built yet** — the Next.js app is a scaffold; wait for user-provided frontend context before implementing UI.

## Module Map

| Task area | Directory |
|-----------|-----------|
| Auth (register, login, refresh, logout, `/me`) | `backend/auth/` + `backend/services/auth.service.ts` |
| Memory CRUD, search, relevance | `backend/memory/` + `backend/services/memory.service.ts` |
| Insights | `backend/insight/` + `backend/services/insight.service.ts` |
| Conversations | `backend/conversation/` + `backend/services/conversation.service.ts` |
| Async AI reflection | `backend/workers/` + `backend/services/reflection.service.ts` |
| AI provider (stub) | `backend/services/ai/` |
| API bootstrap | `backend/app.ts`, `backend/index.ts` |
| Frontend (TBD) | `frontend/src/` |

## Common Commands

```bash
# Backend dev server
cd backend && npm run dev

# Reflection worker (stub)
cd backend && npm run worker

# Frontend dev server
cd frontend && npm run dev
```

## API Quick Reference

- Auth: `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`; `GET /api/v1/auth/me`
- Memories: `POST /memories/create`, `GET /memories`, `/search`, `/relevant`, `/:id`, `PATCH /:id`, `DELETE /:id`
- Insights: `GET /insights`, `POST /insights/generate`, `GET /insights/:id`, `DELETE /insights/:id`
- Conversations: `POST /conversations`, `GET /conversations`, `GET /conversations/:id`, `POST /conversations/:id/messages`, `DELETE /conversations/:id`
- Auth header: raw JWT in `Authorization` (no Bearer prefix)
- Health: `GET /health`

## Spec vs. Code

The `reverie/` folder is the **product spec and roadmap**. The backend is largely implemented — always check `architecture.md` before assuming a feature exists.

**Implemented:** access + refresh tokens, services layer, Memory/Insight/Conversation models, reflection worker, stub AI for reflections/insights/chat, relevance scoring stub.

**Gaps:** password reset, email verification flow, real LLM/embeddings, vector search, separate JournalEntry model (`Memory` is the journal target), frontend product UI.

When the user shares frontend context, add it under `.grok/reverie/` and update `architecture.md`.

## Frontend

For UI work, use `/frontend` instead — it loads `08_FRONTEND_WORKFLOW.md` and Figma MCP integration.
