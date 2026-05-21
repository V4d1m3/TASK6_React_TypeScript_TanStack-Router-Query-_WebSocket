# Task 6 — Bazaar

Universal multi-category marketplace **SPA** powered by [DummyJSON](https://dummyjson.com).  
Built with React 19, TypeScript, Vite, TanStack Router, TanStack Query, and Tailwind CSS v4.

## Functionality

| Route | Description |
| --- | --- |
| `/` | Home — category grid, top-rated products |
| `/login` | Sign-in via DummyJSON `POST /auth/login` (session in `localStorage`) |
| `/catalog` | Shop — search, category, sort, URL-driven pagination |
| `/products/:productId` | Product details — image gallery, specs, add to bag |
| `/cart` | Shopping bag — qty, subtotal, persistence in `localStorage` |
| `/chat` | WebSocket echo chat (`wss://ws.ifelse.io`) |

**Data:** all product endpoints use DummyJSON. No tech-category whitelist (unlike the Task 5 reference) — every API category is available.

**UI:** responsive layout (mobile + desktop), warm “Bazaar” theme via Tailwind design tokens.

## Tech stack

| Layer | Libraries |
| --- | --- |
| UI | React 19, Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | TanStack Router |
| Server state | TanStack Query (+ Devtools in dev) |
| Client state | React Context (auth, cart) + WebSocket (chat) |
| Build | Vite 8, TypeScript 6 (strict) |
| Quality | ESLint (`no-explicit-any`) |

## Dependencies

### Production

- `react`, `react-dom`
- `@tanstack/react-router`
- `@tanstack/react-query`

### Development

- `vite`, `@vitejs/plugin-react`
- `typescript`, `@types/react`, `@types/react-dom`, `@types/node`
- `tailwindcss`, `@tailwindcss/vite`
- `@tanstack/react-query-devtools`
- `eslint`, `typescript-eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`

## Project structure

```
src/
  app/                 # router, query client, providers
  entities/dummy-json/ # API types, fetchers, TanStack Query hooks
  features/
    auth/              # session + localStorage
    cart/              # bag + notices + localStorage
    catalog/           # catalog filters, grid, URL → API mapping
    chat/              # WebSocket hook + chat UI
  pages/               # route-level screens
  shared/              # http client, ApiError, UI kit, helpers
  widgets/             # RootLayout (header, footer)
```

Separation of concerns:

- **Router** — URL / search params (`CatalogSearch`)
- **Query** — HTTP cache keyed by `ProductListParams`
- **WebSocket** — live echo chat on `/chat` (not REST, no TanStack Query)
- **Pages** — composition; heavy UI split into `features/` and `pages/*/ui/`

## Getting started

**Requirements:** Node.js 20+ (22.13+ recommended for ESLint 10).

```bash
npm install
cp .env.example .env   # optional — defaults work for local dev
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | `tsc -b` + production build → `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint (explicit `any` is forbidden) |

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_DUMMYJSON_BASE_URL` | `https://dummyjson.com` | REST API base URL |
| `VITE_WS_URL` | `wss://ws.ifelse.io` | WebSocket echo server for `/chat` |

## WebSocket chat

The `/chat` route connects to a public **echo** server: each sent text frame is returned as a `message` event.

- State: `features/chat/context/ChatProvider.tsx` (history survives route changes)
- Socket helpers: `features/chat/lib/`
- UI: `features/chat/ui/ChatPanel.tsx`
- Auto-connect while the chat page is open; manual Connect / Disconnect / Clear
- Auto-reconnect if the server closes the socket; queued send while reconnecting

## Lighthouse / performance notes

Run audits against the **production** build, not `npm run dev`:

```bash
npm run build
npm run preview
```

Then open the preview URL (e.g. `http://localhost:4173`) in Lighthouse. Dev mode includes Vite HMR, React Refresh, and unminified bundles — scores will be much lower than production.

## Deployment (GitHub Pages)

**Live demo:** https://v4d1m3.github.io/TASK6_React_TypeScript_TanStack-Router-Query-_WebSocket/

### One-time setup in GitHub

1. Push `main` with `.github/workflows/deploy-pages.yml`.
2. Repo → **Settings** → **Pages** → **Build and deployment** → Source: **GitHub Actions**.
3. After the workflow succeeds, the site is available at the URL above.

### How it works

- CI sets `GH_PAGES=true` so Vite `base` matches the repo path.
- TanStack Router uses `import.meta.env.BASE_URL` as `basepath`.
- `404.html` is a copy of `index.html` so deep links work on refresh.

### Local production check (same base as Pages)

```bash
# PowerShell
$env:GH_PAGES='true'; npm run build; Copy-Item dist/index.html dist/404.html; npm run preview
```

Open the preview URL and paths under `/TASK6_React_TypeScript_TanStack-Router-Query-_WebSocket/`.

## Error handling

- `httpClient` throws typed `ApiError` (HTTP status + JSON body).
- DummyJSON `message` field is parsed when present.
- Invalid JSON and network failures are handled explicitly.
- UI surfaces errors on Home, Catalog, Product detail, and Login.
- WebSocket errors show as system messages and connection status.
