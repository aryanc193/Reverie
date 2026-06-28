# Reverie — Coding Conventions

Read `.grok/reverie/07_AGENT_ONBOARDING.md` and the `reverie/00–06` specs before contributing. Use `architecture.md` to verify what exists in code vs. what is planned.

## TypeScript

- Strict mode enabled in both `backend/tsconfig.json` and `frontend/tsconfig.json`
- Backend uses CommonJS modules; frontend uses Next.js defaults
- Prefer explicit types on exported interfaces; use Mongoose `Document` extensions for models

## Backend Patterns

- **Module layout:** `routes.ts` → `controller.ts` → `services/*.service.ts` → `model.ts` per domain
- **Validation:** Zod schemas in `validators/`; apply via `validate()` middleware
- **Errors:** Throw `AppError` from services; `errorHandler` middleware formats `{ error: string }`
- **Auth:** Use `requireAuth` on protected routes; `authorize(...roles)` for role checks; access `req.userId` via `AuthRequest`
- **Error responses:** `{ error: string }` with appropriate HTTP status codes
- **Success responses:** Return the resource directly or `{ success: true }` for deletes
- **No inline AI:** Never call AI services from HTTP handlers for memory reflection; use `workers/` for async processing

## Naming

- Files: `kebab-case` for routes/controllers or `domain.action.ts` pattern (e.g. `memory.controller.ts`)
- Models: PascalCase exports (`Memory`, `User`, `IMemory`, `IUser`)
- API paths: lowercase, RESTful under `/api/v1/`

## Environment

- Never commit `.env` files
- Document new env vars in `backend/.env.example`
- Load secrets via `dotenv` in backend entry points

## Frontend (when implementing)

- Pages Router is in use (`src/pages/`) — do not migrate to App Router without explicit request
- Match existing Next.js 16 + React 19 patterns in the scaffold
- API calls go to backend at `/api/v1/`; store JWT client-side for `Authorization` header
- Frontend context and design decisions are pending — check with user before major UI choices

## Git

- Keep changes focused per module
- Do not add drive-by refactors outside the task scope
