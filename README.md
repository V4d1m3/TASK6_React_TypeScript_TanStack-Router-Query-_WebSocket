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
| `/chat` | WebSocket chat (**extra**, placeholder only) |

**Data:** all product endpoints use DummyJSON. No tech-category whitelist (unlike the Task 5 reference) — every API category is available.

**UI:** responsive layout (mobile + desktop), warm “Bazaar” theme via Tailwind design tokens.

## Tech stack

| Layer | Libraries |
| --- | --- |
| UI | React 19, Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | TanStack Router |
| Server state | TanStack Query (+ Devtools in dev) |
| Client state | React Context (auth, cart) |
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
  pages/               # route-level screens
  shared/              # http client, ApiError, UI kit, helpers
  widgets/             # RootLayout (header, footer)
```

Separation of concerns:

- **Router** — URL / search params (`CatalogSearch`)
- **Query** — HTTP cache keyed by `ProductListParams`
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
| `VITE_WS_URL` | `wss://ws.ifelse.io` | WebSocket endpoint (chat extra) |

## Deployment

1. Run `npm run build`.
2. Deploy the `dist/` folder to [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), or [GitHub Pages](https://pages.github.com/).
3. For GitHub Pages, set the Vite `base` if the app is not served from domain root.

**Live demo:** _TBD — add URL after deploy_

Example:

```text
https://your-username.github.io/TASK6_INNO/
```

## TZ checklist (Task 6)

| Requirement | Status |
| --- | --- |
| React + TypeScript, logic / UI split | Done |
| TanStack Router (multiple pages) | Done |
| TanStack Query + DummyJSON | Done |
| Tailwind CSS UI | Done |
| Vite build | Done |
| Strict typing, no `any` | Done (ESLint + `strict`) |
| Modular architecture | Done (`entities`, `features`, `pages`, `shared`) |
| Adaptive layout | Done |
| README (features, deps, run, deploy link) | Done (deploy URL pending) |
| GitHub repo + structured commits | **You** — push & commit history |
| Deploy + link in README | **Pending** |
| Extra: WebSocket chat | **Pending** (placeholder on `/chat`) |
| Optional: Lighthouse ≥ 90 | Not done |
| Optional: HTML/CSS validation | Not done |
| Optional: mentor Q&A | — |

Tables / charts / maps from TZ are optional — not implemented.

## Error handling

- `httpClient` throws typed `ApiError` (HTTP status + JSON body).
- DummyJSON `message` field is parsed when present.
- Invalid JSON and network failures are handled explicitly.
- UI surfaces errors on Home, Catalog, Product detail, and Login.

## Reference

Feature scope is inspired by [TASK5_INNO](../TASK5_INNO) (Webpack + Redux + RTK Query), rebuilt with a different stack, visual theme, and full DummyJSON catalog.
