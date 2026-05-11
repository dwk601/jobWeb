# Koreer

Cross-border job search for bilingual professionals in the US and South Korea.

## Setup

```bash
cp .env.example .env
npm ci
npm run dev
```

## Environment

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL used for SEO |

In development, API requests are proxied through Next.js rewrites so no CORS issues.

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # production build
npm run lint    # biome check
npm run format  # biome format
```

## Stack

Next.js 16, React 19, Tailwind CSS v4, shadcn/ui v4, TanStack Query, nuqs

https://github.com/dwk601/jobWeb
