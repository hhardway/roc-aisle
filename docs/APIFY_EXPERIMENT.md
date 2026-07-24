# Apify cheap price experiment (Walmart + Target)

Goal: spend roughly **$0–15** (ideally under the Apify free **$5/mo** credits) to pull real search prices for a few staples and compare them to our catalog.

## Important limitation

The cheapest TrueFetch actors:

- [Walmart Price Tracker](https://apify.com/truefetch/walmart-price-tracker) (`truefetch/walmart-price-tracker`)
- [Target Price Tracker](https://apify.com/truefetch/target-price-tracker) (`truefetch/target-price-tracker`)

**do not accept ZIP / store ID.** They return public **Walmart.com / Target.com** search snapshots.

That is still useful for a cheap experiment, but it is **not guaranteed Rochester shelf price**.

For Walmart **with ZIP 55901**, use a ZIP-aware actor such as [junipr/walmart-scraper](https://apify.com/junipr/walmart-scraper) (`storeId: "1971"`, `zipCode: "55901"` for the NW Rochester Supercenter). That usually costs more per run than TrueFetch.

Target TrueFetch also has **no ZIP input** — local Target prices still need manual check or a different (often pricier) scraper.

## Cost math (TrueFetch, free tier)

Per keyword run (approx.):

| Store | Start fee | Per result | 10 results |
|---|---|---|---|
| Walmart | $0.01 | ~$0.0088 | **~$0.10** |
| Target | $0.01 | ~$0.0081 | **~$0.09** |

Example budgets:

| Experiment | Runs | Approx. cost |
|---|---|---|
| 5 staples × both stores | 10 runs | **~$1.00** |
| 15 staples × both stores | 30 runs | **~$3.00** |
| 40 staples × both stores | 80 runs | **~$8.00** (may exceed free $5) |

Keep `max_results: 10` (actor minimum) and take the **first / best-matching** row only.

## Step-by-step

### 1. Create an Apify account
1. Go to [https://console.apify.com/sign-up](https://console.apify.com/sign-up)
2. Free plan includes about **$5/month** platform credits

### 2. Get an API token
1. [https://console.apify.com/account/integrations](https://console.apify.com/account/integrations)
2. Copy your personal API token
3. In this project:

```bash
cd grocery-app
cp .env.example .env
# put the token in .env as APIFY_TOKEN=...
```

### 3. Install the Apify client (one-time)

```bash
npm install apify-client
```

### 4. Run the probe script

```bash
# default: milk, eggs, bread, bananas, pasta on Walmart + Target
node scripts/apify-price-probe.mjs

# custom keywords
node scripts/apify-price-probe.mjs "whole milk" "large eggs" "wheat bread"
```

Output: `scripts/output/apify-probe-*.json` with the top hit price per store/keyword.

### 5. Optional: Walmart with Rochester ZIP

In Apify Console, open `junipr/walmart-scraper` and run with:

```json
{
  "searchTerms": ["gallon whole milk", "dozen large eggs"],
  "maxProducts": 5,
  "includeReviews": false,
  "includeVariants": false,
  "includeSeller": false,
  "includePickup": true,
  "storeId": "1971",
  "zipCode": "55901",
  "sortBy": "price_low",
  "maxChargeUsd": 2
}
```

Rochester NW Supercenter: **store 1971**, ZIP **55901**.

### 6. Decide what “good enough” means

- If online prices are close enough → wire a nightly cron that updates `src/data/prices.ts` (or a JSON file the app loads).
- If you need true in-store Rochester prices → plan for ZIP-aware scrapers + manual Hy-Vee.

## What success looks like

After one ~$1–3 run you should know:

1. Whether matching “milk” → a sensible product is good enough
2. How noisy grocery search results are (brand/size variance)
3. Whether Apify credits are worth continuing vs weekly manual updates

## Security

Never commit `.env` or put `APIFY_TOKEN` in the frontend. Only run probes from your machine or a private backend.
