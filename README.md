# Task 6 — Bazaar (Vite + TanStack + Tailwind)

Universal multi-category marketplace SPA powered by [DummyJSON](https://dummyjson.com).  
Built with React 19, TypeScript, Vite, TanStack Router, TanStack Query, and Tailwind CSS v4.

## Features

| Route | Description |
| --- | --- |
| `/` | Home — all categories, top-rated picks |
| `/login` | Sign-in via `POST /auth/login` (session in `localStorage`) |
| `/catalog` | Shop — search, category, sort, pagination (all DummyJSON categories) |
| `/products/:productId` | Product details, gallery, add to bag |
| `/cart` | Shopping bag with persistence |
| `/chat` | WebSocket chat placeholder (extra) |

Unlike the Task 5 reference app, **no category whitelist** is applied — beauty, groceries, furniture, and every other DummyJSON department are available.

## Tech stack

- `react`, `react-dom`
- `@tanstack/react-router`
- `@tanstack/react-query`
- `tailwindcss`, `@tailwindcss/vite`
- `vite`, `typescript`, `eslint`

## Project structure

```
src/
  app/              # router, query client, providers
  entities/         # DummyJSON types & API + Query hooks
  features/         # auth, cart (context + persistence)
  pages/            # route screens
  shared/           # UI kit, HTTP client, catalog helpers
  widgets/          # layout shell
```

## Getting started

**Requirements:** Node.js 20+ (22.13+ recommended for ESLint 10).

```bash
npm install
cp .env.example .env   # optional — defaults work locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | ESLint (`any` is forbidden) |

## Environment

| Variable | Default |
| --- | --- |
| `VITE_DUMMYJSON_BASE_URL` | `https://dummyjson.com` |
| `VITE_WS_URL` | `wss://ws.ifelse.io` |

## Deployment

Deploy the `dist` folder to Netlify, Vercel, or GitHub Pages.

**Live demo:** _TBD — add URL after deploy_

## Reference

Feature scope inspired by [TASK5_INNO](../TASK5_INNO) (Webpack + Redux + RTK Query), with a different stack, visual theme, and unrestricted catalog.
