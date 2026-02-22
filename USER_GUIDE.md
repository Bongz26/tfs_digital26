**TFS Digital — User Guide**

Overview
-
TFS Digital is a full-stack application for managing cases, inventory, purchase orders, rosters, vehicles, and reporting. The repository contains a React front-end (`client/`) and an Express back-end (`server/`) that uses Supabase and Postgres for data storage and authentication.

Quick Start (developer)
-
Prerequisites:
- Node.js (recommended v18.18.x — server `engines` suggests >=18.18.0 <19.0.0)
- npm

Install dependencies (root):

```bash
npm run install:all
```

Start services (development):

```bash
# start server (runs server/index.js)
npm run start:server

# start client dev server (CRA)
npm run start:client
```

Build production front-end:

```bash
npm run build:client
```

Run the full app (serve built client via server):

1. Build the client (`npm run build:client`).
2. Ensure `client/build` exists, then start the server (`npm run start:server`). The server serves static files automatically if `client/build` is present.

Environment variables (important)
-
The server uses several environment variables. Create a `.env` in `server/` with values appropriate for your environment. Important keys used:

- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (recommended for backend operations; bypasses RLS)
- `SUPABASE_ANON_KEY` or `SUPABASE_KEY` — public anon key (used if service role key missing)
- `FRONTEND_URL` — production frontend origin (used for redirects/CORS)
- `PORT` — server port (default 5001)
- Standard mail/email env vars (SendGrid / SMTP) — see docs: `GMAIL_SETUP_STEPS.md`, `QUICK_EMAIL_SETUP.md` in repo root

Authentication & Authorization
-
The backend exposes `/api/auth` for registration, login, password reset, and user management. Most API routes are protected via `requireAuth`. Some routes require elevated roles (`requireMinRole('staff')` or admin checks).

API Overview
-
The server mounts many functional route groups under `/api/*`. Examples:

- `/api/auth` — register, login, me, user management
- `/api/cases` — create, search, merge, assign vehicles, update status
- `/api/inventory` — inventory items, transfers, stock takes, reports
- `/api/purchase-orders` — create PO, add items, receive, process
- `/api/roster`, `/api/vehicles`, `/api/drivers`, `/api/livestock` — operational resources
- `/api/dashboard` — aggregated metrics
- `/api/public/*` — a few public endpoints (for stock email and coffin usage raw data)

See `server/routes/` for the full endpoint list. If you need a machine-readable spec (OpenAPI), I can generate one from the routes.

Common user workflows (front-line)
-
- Creating a case: Use the front-end form to submit; backend endpoint `/api/cases` handles creation and assignment workflows.
- Managing inventory: add inventory items or transfers via the UI which uses `/api/inventory` routes.
- Raising a purchase order: create via the UI which calls `/api/purchase-orders` and receive GRV when goods arrive.
- Rostering and drivers: manage via roster UI pages (calls to `/api/roster` and `/api/drivers`).

Deployment notes
-
- For simple deployments, build the React app and serve it from the Express server. The server automatically serves `client/build` when present.
- Ensure the `SUPABASE_SERVICE_ROLE_KEY` and mail credentials are set in production environment variables.
- Recommended Node version is consistent with `server/package.json` `engines` (v18.x). Running much newer Node (e.g., v24) will work but may warn about engine mismatch.

Troubleshooting
-
- Permission denied errors from Supabase: ensure `SUPABASE_SERVICE_ROLE_KEY` is set in the server `.env` for backend operations that require bypassing RLS.
- If frontend does not load in production, verify `client/build` exists and `FRONTEND_URL` / CORS settings are correct.
- Audit/vulnerability notices from `npm install`: run `npm audit` and consider updating dependencies or running `npm audit fix` (note: use `--force` carefully).

Docs and useful files
-
- Main scripts: [package.json](package.json)
- Server entrypoint: [server/index.js](server/index.js)
- Client README and CRA docs: [client/README.md](client/README.md)
- Operational guides: `DEPLOYMENT_CHECKLIST.md`, `GMAIL_SETUP_STEPS.md`, `GOOGLE_MAPS_API_SETUP.md`, `QUICK_START_GUIDE.md` (see repo root)

Next steps I can help with
-
- Generate a `.env.example` with all referenced env vars.
- Produce an OpenAPI/Swagger spec for the API.
- Create a short quick-start README tailored to non-developer users.

Contact / Support
-
If you want me to expand any section, generate the OpenAPI spec, or create step-by-step admin instructions, tell me which one and I will add it.
