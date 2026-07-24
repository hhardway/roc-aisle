#!/usr/bin/env node
/**
 * Cheap Apify experiment: keyword price probe for Walmart + Target.
 *
 * Usage:
 *   APIFY_TOKEN=... node scripts/apify-price-probe.mjs
 *   node scripts/apify-price-probe.mjs "milk" "eggs" "bread"
 *
 * Requires: npm install apify-client
 * Docs: docs/APIFY_EXPERIMENT.md
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ApifyClient } from "apify-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const ACTORS = {
  walmart: "truefetch/walmart-price-tracker",
  target: "truefetch/target-price-tracker",
};

const DEFAULT_KEYWORDS = ["milk", "eggs", "bread", "bananas", "pasta"];

async function loadToken() {
  if (process.env.APIFY_TOKEN) return process.env.APIFY_TOKEN.trim();
  try {
    const envText = await readFile(join(root, ".env"), "utf8");
    const match = envText.match(/^APIFY_TOKEN=(.*)$/m);
    if (match?.[1]) return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    // no .env
  }
  return null;
}

function pickPrice(item) {
  const candidates = [
    item.price,
    item.current_price,
    item.currentPrice,
    item.sale_price,
    item.salePrice,
    item.price_value,
    item.priceValue,
  ];
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const n = Number(value.replace(/[^0-9.]/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

function pickTitle(item) {
  return (
    item.title ||
    item.name ||
    item.product_title ||
    item.productTitle ||
    item.product_name ||
    "Unknown product"
  );
}

function pickUrl(item) {
  return item.url || item.product_url || item.productUrl || item.link || null;
}

async function searchStore(client, store, keyword) {
  const actorId = ACTORS[store];
  const run = await client.actor(actorId).call(
    {
      keyword,
      country: "United States",
      max_results: 10,
    },
    {
      waitSecs: 180,
    },
  );

  const { items } = await client.dataset(run.defaultDatasetId).listItems({
    limit: 10,
  });

  const top = items[0] ?? null;
  return {
    store,
    keyword,
    runId: run.id,
    datasetId: run.defaultDatasetId,
    hitCount: items.length,
    top: top
      ? {
          title: pickTitle(top),
          price: pickPrice(top),
          url: pickUrl(top),
          raw: top,
        }
      : null,
  };
}

async function main() {
  const token = await loadToken();
  if (!token) {
    console.error(
      "Missing APIFY_TOKEN. Copy .env.example → .env and paste your token from https://console.apify.com/account/integrations",
    );
    process.exit(1);
  }

  const keywords =
    process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_KEYWORDS;

  console.log(
    `Probing ${keywords.length} keywords × 2 stores (TrueFetch). ZIP is NOT applied by these actors.\n`,
  );

  const client = new ApifyClient({ token });
  const results = [];

  for (const keyword of keywords) {
    for (const store of ["walmart", "target"]) {
      process.stdout.write(`→ ${store}: "${keyword}" ... `);
      try {
        const row = await searchStore(client, store, keyword);
        results.push(row);
        const price =
          row.top?.price != null ? `$${row.top.price.toFixed(2)}` : "n/a";
        console.log(
          `${price} — ${row.top?.title?.slice(0, 60) ?? "no hit"} (${row.hitCount} rows)`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`FAILED: ${message}`);
        results.push({ store, keyword, error: message });
      }
    }
  }

  const outDir = join(__dirname, "output");
  await mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = join(outDir, `apify-probe-${stamp}.json`);

  const slimResults = results.map((row) => {
    if (!row.top) return row;
    const { raw: _raw, ...top } = row.top;
    return { ...row, top };
  });

  await writeFile(
    outPath,
    JSON.stringify(
      {
        note: "TrueFetch actors return public .com search prices, not guaranteed Rochester shelf prices.",
        zipRequestedButUnsupported: "55901",
        ranAt: new Date().toISOString(),
        keywords,
        results: slimResults,
        fullResultsWithRaw: results,
      },
      null,
      2,
    ),
  );

  console.log(`\nSaved ${outPath}`);
  console.log(
    "Next: compare these prices to src/data/prices.ts, or try junipr/walmart-scraper with zipCode 55901.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
