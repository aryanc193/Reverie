---
name: frontend
description: >
  Build the Reverie frontend from Figma designs. Use when the user asks to
  implement UI, build screens, integrate the Next.js app with the backend API,
  or runs /frontend. Requires Figma MCP (figma server in .grok/config.toml).
  Loads the frontend workflow, Figma links, and architecture before coding.
metadata:
  short-description: "Reverie frontend build workflow with Figma MCP"
---

# Reverie Frontend Skill

Build the Reverie product UI in `frontend/` using designs from Figma and the existing backend API.

## Before Writing Code

1. `.grok/reverie/08_FRONTEND_WORKFLOW.md` — phased build plan
2. `.grok/reverie/figma-links.md` — frame URLs (ask user to fill if empty)
3. `.grok/architecture.md` — API contracts and data models
4. `.grok/rules/conventions.md` — Pages Router, no inline backend logic

## Figma MCP (required)

Project config: `.grok/config.toml` → **`figma-dev`** (stdio, PAT-based). User must `export FIGMA_API_KEY=figd_...` before starting grok.

Verify: `grok mcp doctor figma-dev`. Remote OAuth `figma` is disabled — OAuth often fails in embedded terminals.

### Tool sequence per screen

1. Read the frame URL from `figma-links.md`.
2. `figma-dev__get_variable_defs` — design tokens → CSS variables.
3. `figma-dev__get_design_context` — layout and component structure (ask for plain HTML + CSS Modules if not specified).
4. `figma-dev__get_screenshot` — visual reference.
5. `figma-dev__get_code_connect_map` — reuse mapped components when available.
6. `figma__download_assets` — icons/images to `frontend/public/`.

Remote MCP is link-based: always pass the full Figma frame URL in tool calls.

## Implementation Rules

- **Pages Router only** — `frontend/src/pages/`; do not migrate to App Router.
- **Backend is source of truth** — no duplicated business logic; call `/api/v1/` endpoints.
- **Auth header** — raw JWT in `Authorization` (no `Bearer` prefix).
- **API base** — `NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`).
- **Structure** — pages thin; logic in `lib/api/` and `hooks/`; UI in `components/`.
- **Styling** — CSS Modules + CSS variables from Figma tokens; match existing scaffold patterns.
- **No reflection triggers in UI** — display `memory.reflection` when worker has finished.

## Phase Order

Follow `08_FRONTEND_WORKFLOW.md` strictly:

0. Foundation (API client, auth context, tokens, app shell)
1. Auth (login, register)
2. Journal / memories (CRUD, search, reflection display)
3. Insights
4. Conversations
5. Polish

Do not skip phases unless the user explicitly requests a single screen and dependencies exist.

## Common Commands

```bash
cd backend && npm run dev      # API on :3000
cd backend && npm run worker   # reflection worker
cd frontend && npm run dev     # UI on :3000 or :3001
```

## When Figma Links Are Missing

Ask the user for:

1. Figma file URL (or per-screen frame links)
2. Which phase/screen to build first
3. Whether they use a shared component library (for `search_design_system`)

Then update `figma-links.md` before implementing.

## Done Criteria (per screen)

- Matches Figma screenshot within reasonable fidelity
- Wired to correct backend endpoint(s)
- Loading, error, and empty states present
- Works with real backend running locally
