# Reverie — Figma File Links

> Fill in these URLs before starting frontend implementation.  
> In Figma: right-click a frame → **Copy link to selection**.

## Design file

| Item | URL | Node ID (optional) |
|------|-----|-------------------|
| Full design file | https://www.figma.com/design/tUsILpzgDGLenz5TkhpAaO/Reverie?node-id=1-2&t=iDKzt0RJZgwzhfOg-0 | — |
| Design system / tokens page | | |
| Component library page | | |

## Screens (map each frame to a route)

| Screen | Figma link | Next.js route | Backend API |
|--------|------------|---------------|-------------|
| Login | | `/login` | `POST /api/v1/auth/login` |
| Register | | `/register` | `POST /api/v1/auth/register` |
| Dashboard | https://www.figma.com/design/tUsILpzgDGLenz5TkhpAaO/Reverie?node-id=1-2&t=iDKzt0RJZgwzhfOg-0 | `/` | (shell — journal + chat) | `GET /api/v1/memories` |
| New entry | | `/journal/new` | `POST /api/v1/memories/create` |
| Entry detail | | `/journal/[id]` | `GET /api/v1/memories/:id` |
| Edit entry | | `/journal/[id]/edit` | `PATCH /api/v1/memories/:id` |
| Search | | `/search` | `GET /api/v1/memories/search` |
| Insights list | | `/insights` | `GET /api/v1/insights` |
| Generate insight | | `/insights` (action) | `POST /api/v1/insights/generate` |
| Chat list | | `/chat` | `GET /api/v1/conversations` |
| Chat thread | | `/chat/[id]` | `GET/POST /api/v1/conversations/:id` |
| Profile / settings | | `/settings` | `GET /api/v1/auth/me`, `POST /auth/logout` |

## FigJam (optional)

| Board | URL | Purpose |
|-------|-----|---------|
| User flows | | Onboarding, navigation |
| IA / sitemap | | Page hierarchy |

## Notes

- Remote Figma MCP is **link-based** — paste frame URLs into prompts; the agent extracts `node-id` from the URL.
- Keep this file updated when frames are renamed or restructured.

## MCP auth note

Remote `figma` OAuth often fails in embedded terminals (browser never opens / "failed to auth").
Use **`figma-dev`** (Personal Access Token) instead — see `08_FRONTEND_WORKFLOW.md` → Figma MCP Authentication.
