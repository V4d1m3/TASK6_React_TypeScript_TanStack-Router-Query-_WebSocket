# Task 6 — React SPA (Vite + TanStack + Tailwind)

Educational multi-page React SPA aligned with the Task 5 reference app (catalog, auth, cart), rebuilt on a modern stack: **Vite**, **TanStack Router**, **TanStack Query**, **TypeScript**, and **Tailwind CSS**.

> **Status:** project scaffold only — routes and providers are wired; business features are not implemented yet.

## Planned functionality

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/login` | Authentication via DummyJSON |
| `/catalog` | Product list (search, filters, sorting, pagination) |
| `/products/:productId` | Product details |
| `/cart` | Shopping cart |
| `/chat` | WebSocket chat (extra) |

Data source: [DummyJSON](https://dummyjson.com). WebSocket (extra): `wss://ws.ifelse.io`.

## Tech stack

### Runtime

- `react`, `react-dom`
- `@tanstack/react-router` — routing
- `@tanstack/react-query` — server state & caching

### UI

- `tailwindcss`, `@tailwindcss/vite`

### Tooling

- `vite`, `@vitejs/plugin-react`
- `typescript`
- `eslint`, `typescript-eslint`

## Project structure

```
src/
  app/           # router, query client, providers
  pages/         # route-level screens
  widgets/       # layout & composite UI
  features/      # feature modules (auth, cart, …)
  entities/      # API models & data access
  shared/        # config, HTTP client, reusable UI
```

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
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint (`any` is forbidden) |

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_DUMMYJSON_BASE_URL` | `https://dummyjson.com` | REST API base URL |
| `VITE_WS_URL` | `wss://ws.ifelse.io` | WebSocket endpoint (chat extra) |

## Deployment

Deploy the `dist` folder to Netlify, Vercel, or GitHub Pages.

**Live demo:** _TBD — add URL after deploy_

## Reference

Feature scope mirrors [TASK5_INNO](../TASK5_INNO) (Webpack + Redux Toolkit + RTK Query + React Router).
