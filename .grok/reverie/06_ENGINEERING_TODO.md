# Engineering TODO

## Completed (as of 2026-06-21)

### Phase 0 — Scaffolding
- Services layer (`backend/services/`)
- Zod validation (`backend/validators/`, `middleware/validate.ts`)
- Centralized error handling (`middleware/error-handler.ts`)
- Typed env config (`config/env.ts`)
- Rate limiting on auth routes

### Phase 1 — Auth
- Access + refresh token pair with rotation
- `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- User schema: `role`, `isVerified`, `refreshTokens`
- `authorize(...roles)` middleware

### Phase 2 — Memory / journaling
- `title`, `mood`, `tags` on Memory model
- List filters: mood, tags, important
- `GET /memories/search` (MongoDB text index)

### Phase 3 — Reflection worker
- Polling worker with processing status lifecycle
- Stub AI service (`services/ai/`) with swappable factory
- Retry/backoff and stale-processing recovery

### Phase 4 — Insights
- `Insight` model and CRUD APIs
- `POST /insights/generate` (stub aggregator)

### Phase 5 — Conversations
- `Conversation` model with message history
- Stub chat replies via `AiService.generateChatReply`

### Phase 6 — Retrieval stub
- `GET /memories/relevant` with scored text/tag matching

### Phase 7 — Tests
- Jest + Supertest + mongodb-memory-server
- Unit tests: relevance scoring, stub AI, memory invalidation
- Integration tests: auth, memory, insights, conversations, worker pipeline
- `npm test` in `backend/`

## Deferred / Future

- Password reset / email verification
- Real LLM provider (`AI_PROVIDER=openai` etc.)
- Vector DB / true semantic search
- `JournalEntry` split (Memory remains journal write target)
- Frontend product UI
- Production deployment config
- Scheduled insight generation (cron/queue)
