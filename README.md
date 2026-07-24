# ROC Aisle

Rochester, MN grocery price helper. Paste a shopping list and get a per-item recommendation for **Walmart**, **Target**, or **Hy-Vee** based on price — plus a split-store trip plan.

## Run locally

```bash
cd grocery-app
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Deploy publicly

### GitHub Pages (configured)

Push to `main` and the Actions workflow deploys to:

**https://hhardway.github.io/roc-aisle/**

### Vercel (optional)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Framework preset: Vite — build `npm run build`, output `dist`
3. Deploy — you get a `*.vercel.app` URL (and custom domain if you want)

`vercel.json` is already in the repo for SPA routing.

### Netlify (optional)

1. Import the repo at [app.netlify.com](https://app.netlify.com)
2. Build command `npm run build`, publish directory `dist`

`netlify.toml` is already in the repo.

## Live price experiment (Apify)

See [docs/APIFY_EXPERIMENT.md](docs/APIFY_EXPERIMENT.md) for a ~$1–5 Walmart + Target probe using free Apify credits.

```bash
cp .env.example .env   # add APIFY_TOKEN
npm run probe:apify
```

## How it works

1. Enter items one per line (or comma-separated).
2. The app fuzzy-matches each line against a Rochester catalog in `src/data/prices.ts`.
3. Cheapest store wins for that item; results also show a multi-stop shopping plan.

## Updating prices

Edit `src/data/prices.ts`. Prices are illustrative local estimates for the demo — not live API feeds. Refresh them from store apps or weekly ads when you want accuracy.

## Stack

Vite · React · TypeScript · Framer Motion
