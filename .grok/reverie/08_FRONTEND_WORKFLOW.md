# Frontend Build Workflow

> Last updated: 2026-06-28  
> Design-to-code workflow for Reverie using **Figma MCP** + the existing Next.js 16 scaffold.

## Prerequisites

| Requirement | Status |
|-------------|--------|
| Backend API running (`cd backend && npm run dev`) | Required |
| Figma design file with screen frames | Required (user provides links) |
| Figma MCP authenticated | Run once per machine (see below) |
| `figma-links.md` filled in | Required before screen work |

## Figma MCP Setup (project-scoped)

This repo ships Figma MCP in `.grok/config.toml`:

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
enabled = true
```

### One-time authentication

1. Start a Grok session in this repo (`grok` or Cursor agent).
2. Run `/mcps` (or open MCP settings).
3. Find **figma** → authenticate via OAuth (**Connect** / `i`).
4. Verify: `grok mcp doctor figma` (from repo root).

Remote server endpoint: `https://mcp.figma.com/mcp`  
Docs: [Figma MCP guide](https://help.figma.com/hc/en-us/articles/32132100833559)

### Key Figma MCP tools for this project

| Tool | When to use |
|------|-------------|
| `get_design_context` | Primary — layout, typography, spacing for a frame URL |
| `get_screenshot` | Visual fidelity check alongside generated code |
| `get_variable_defs` | Extract color, spacing, typography tokens → CSS variables |
| `get_metadata` | File/page structure before drilling into frames |
| `search_design_system` | Find existing components/variables in linked libraries |
| `get_code_connect_map` | Reuse mapped React components if Code Connect is set up |
| `download_assets` | Export icons/images into `frontend/public/` |
| `generate_figma_design` | Round-trip QA — capture localhost UI back to Figma (optional) |

**Prompt pattern:** paste a Figma frame URL, then ask the agent to implement it for Next.js Pages Router using tokens from `get_variable_defs`.

## Target Frontend Architecture

Stay aligned with existing conventions (`.grok/rules/conventions.md`):

```
frontend/src/
├── pages/              # Pages Router (do NOT migrate to App Router)
├── components/
│   ├── ui/             # Primitives (Button, Input, Card…)
│   └── features/       # Domain components (MemoryCard, MoodPicker…)
├── lib/
│   ├── api/            # Typed API client + domain modules
│   └── auth/           # Token storage, refresh, session context
├── hooks/
├── styles/
│   ├── globals.css     # CSS variables from Figma tokens
│   └── tokens.css      # Generated from get_variable_defs (optional split)
└── types/              # Shared TS types mirroring API responses
```

### Stack decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 16 Pages Router | Already scaffolded |
| Styling | CSS Modules + CSS variables | Matches scaffold; no new deps unless user requests |
| Data fetching | `fetch` in `getServerSideProps` / client hooks | Simple; no React Query until needed |
| Auth | Access token in memory + refresh in httpOnly cookie **or** localStorage | Start with localStorage + refresh flow matching backend |
| API base | `NEXT_PUBLIC_API_URL` | Default `http://localhost:3000/api/v1` |

## Build Phases

Execute in order. Each phase ends with a manual smoke test against the running backend.

### Phase 0 — Foundation

**Goal:** API client, auth plumbing, design tokens, app shell.

1. **Extract tokens from Figma**
   - MCP: `get_variable_defs` on the design-system frame (link in `figma-links.md`).
   - Map Figma variables → CSS custom properties in `globals.css`.

2. **Scaffold lib layer**
   - `lib/api/client.ts` — base fetch, attach `Authorization` header (raw JWT, no Bearer).
   - `lib/api/auth.ts`, `memory.ts`, `insight.ts`, `conversation.ts`.
   - `lib/auth/session.tsx` — React context for user + tokens.

3. **App shell from Figma**
   - MCP: `get_design_context` + `get_screenshot` on nav/shell frame.
   - Implement `components/layout/AppShell.tsx`.
   - Update `_app.tsx` with auth provider + global styles.

4. **Env**
   - Add `frontend/.env.local` from `.env.example`.

**Done when:** unauthenticated user sees shell; `GET /health` reachable from browser.

### Phase 1 — Auth

**Screens:** Login, Register (Figma links in `figma-links.md`).

1. Per screen: `get_design_context` → implement page in `pages/login.tsx`, `pages/register.tsx`.
2. Wire `POST /auth/login`, `POST /auth/register`.
3. Store `{ accessToken, refreshToken }`; redirect to journal on success.
4. Add `POST /auth/refresh` interceptor for 401 recovery.
5. Protected route helper: redirect to `/login` if no session.

**Done when:** register → login → land on journal list works end-to-end.

### Phase 2 — Journal / Memories

**Screens:** List, New entry, Detail, Edit.

| UI action | API |
|-----------|-----|
| List with filters | `GET /memories?mood=&tags=&important=` |
| Create | `POST /memories/create` |
| View | `GET /memories/:id` |
| Edit | `PATCH /memories/:id` |
| Delete | `DELETE /memories/:id` |
| Search | `GET /memories/search?query=` |

1. Implement list + empty state from Figma.
2. Rich text: start with `<textarea>`; upgrade editor only if design requires.
3. Mood picker + tags UI per design.
4. Show `reflection` subdoc when `processingStatus === 'done'`.
5. Show processing indicator when `pending` / `processing`.

**Done when:** full CRUD cycle works; reflection appears after worker processes entry.

### Phase 3 — Insights

**Screens:** Insights list, generate action.

1. `GET /insights` — card list from Figma.
2. `POST /insights/generate` — button with loading state.
3. `DELETE /insights/:id` — confirm dialog.

**Done when:** generate creates stub insight visible in list.

### Phase 4 — Conversations

**Screens:** Chat list, thread.

1. `GET /conversations` — list.
2. `POST /conversations` — new chat.
3. `GET /conversations/:id` — message history.
4. `POST /conversations/:id/messages` — send + render assistant reply.

**Done when:** multi-turn chat works with stub replies.

### Phase 5 — Polish

1. Loading / error / empty states for every screen.
2. Responsive breakpoints from Figma constraints.
3. Optional: Code Connect mappings (`add_code_connect_map`) for reused components.
4. Optional: `generate_figma_design` to capture localhost for design QA.
5. Accessibility pass (focus order, labels, contrast from tokens).

## Per-Screen Implementation Loop

Use this loop for **every** screen:

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Figma frame │────▶│ Figma MCP tools  │────▶│ Next.js page +  │
│ URL in      │     │ context + shot + │     │ components      │
│ figma-links │     │ variables        │     │                 │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                      │
                      ┌──────────────────┐            │
                      │ Manual test vs   │◀───────────┘
                      │ backend API      │
                      └──────────────────┘
```

**Agent checklist per screen:**

1. Read frame URL from `figma-links.md`.
2. Call `get_variable_defs` (if not cached) + `get_design_context` + `get_screenshot`.
3. Check `get_code_connect_map` for existing component mappings.
4. Implement page + feature components; no business logic in pages — use hooks/lib.
5. Wire API calls; scope all data to authenticated user.
6. Compare screenshot to running `npm run dev` page.
7. Download any icons via `download_assets` → `frontend/public/icons/`.

## API Integration Rules

- Base URL: `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`).
- Auth header: `Authorization: <accessToken>` — **no** `Bearer` prefix (matches backend).
- Refresh: on 401, call `POST /auth/refresh` with `{ refreshToken }`, retry once.
- CORS: backend already uses `cors()` — frontend on port 3001 is fine.
- Do not call AI endpoints directly for reflection — that's worker-only; UI reads `memory.reflection`.

## Running Locally

```bash
# Terminal 1 — API
cd backend && npm run dev

# Terminal 2 — reflection worker (to see reflections populate)
cd backend && npm run worker

# Terminal 3 — frontend
cd frontend && npm run dev
```

## Slash Command

Run `/frontend` to load the frontend skill, which pulls this workflow + `figma-links.md` + `architecture.md`.


## Figma MCP Setup (recommended: `figma-dev` + PAT)

Remote Figma OAuth (`figma` server) is **disabled by default** in `.grok/config.toml` because OAuth frequently fails in Cursor and embedded terminals — Connect/`i` does nothing or returns **failed to auth**.

Use **`figma-dev`** instead (Framelink / `figma-developer-mcp`). It uses a Figma **Personal Access Token** — no browser OAuth.

### 1. Create a Figma token

1. Figma → **Settings** → **Security** → **Personal access tokens**
2. Create token with **File content (read)** scope
3. Copy the token (`figd_...`)

### 2. Export the token

In the same terminal session before starting `grok`:

```bash
export FIGMA_API_KEY="figd_YOUR_TOKEN_HERE"
```

Or add to `~/.zshrc` (do not commit the token).

### 3. Verify MCP

```bash
cd /Users/argus/Desktop/code/genAI/Reverie
export FIGMA_API_KEY="figd_..."
grok mcp doctor figma-dev
```

Expect handshake passed and tools listed.

### 4. Refresh in session

Run `/mcps` → press `r` to refresh → **figma-dev** should show tools (not 0).

---

## Figma MCP Authentication Troubleshooting (remote OAuth)

`grok mcp doctor figma` failing with **OAuth authorization required** means tokens were never saved to `~/.grok/mcp_credentials.json`.

The **Connect** button often fails silently in Cursor (known bug: browser never opens). Try these in order:

### Fix 1 — Authenticate from standalone Grok TUI (most reliable)

Use Terminal.app **outside** Cursor:

```bash
cd /Users/argus/Desktop/code/genAI/Reverie
grok
```

Then:

1. Run `/mcps`
2. Select **figma**
3. Press **`i`** to authenticate (not just Enter on Connect)
4. Complete Figma OAuth in the browser
5. Verify: `grok mcp doctor figma` → healthy

### Fix 2 — Manual OAuth URL from Cursor logs

If using Cursor MCP settings:

1. **View → Output**
2. Dropdown: **MCP: figma** (or similar)
3. Click **Connect** or the **"Needs authentication"** text (not only the blue button)
4. Copy the `Redirect to authorization requested` URL from logs
5. Paste it into Chrome/Safari manually
6. After allowing access, refresh MCP in Cursor

### Fix 3 — Figma plugin in Cursor

In Cursor agent chat:

```text
/add-plugin figma
```

Install the plugin, then **Settings → Tools & MCP → figma → Connect**.

### Fix 4 — Desktop Figma MCP (no remote OAuth)

If remote OAuth keeps failing:

1. Open **Figma desktop app** → Dev Mode (Shift+D) → enable **Desktop MCP server**
2. Uncomment `figma-desktop` in `.grok/config.toml`
3. Disable remote `figma` if you only want desktop
4. Refresh `/mcps` — desktop server uses `http://127.0.0.1:3845/mcp` (no browser OAuth)

Desktop MCP supports **selection-based** context (select a frame in Figma, then prompt the agent).

### Verify success

```bash
cd /Users/argus/Desktop/code/genAI/Reverie
grok mcp doctor figma
# Expect: handshake passed, tools available

ls ~/.grok/mcp_credentials.json
# File should exist after successful auth (remote server)
```

## Deferred (not in initial build)

- Password reset UI (backend not built)
- Email verification flow
- Real-time reflection updates (polling or websockets later)
- Rich text editor beyond textarea
- App Router migration
