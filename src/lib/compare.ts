import {
  CATALOG,
  STORES,
  formatPackLabel,
  getPackQty,
  getPriceMeta,
  getUnitPrice,
  type GroceryItem,
  type PriceMeta,
  type StoreId,
} from "../data/prices";

export type PriceRow = {
  storeId: StoreId;
  storeName: string;
  /** What you pay at checkout for the pack/item */
  shelfPrice: number;
  /** How many catalog units are in that shelf price */
  packQty: number;
  /** shelfPrice / packQty — used for ranking */
  unitPrice: number;
  /** e.g. "2 × loaf" or "lb" */
  packLabel: string;
  meta: PriceMeta;
};

export type MatchedResult = {
  query: string;
  status: "matched";
  item: GroceryItem;
  prices: PriceRow[];
  bestStoreId: StoreId;
  /** Best unit price among stores */
  bestUnitPrice: number;
  /** Shelf price at the best unit-price store */
  bestShelfPrice: number;
  /** Unit-price gap vs worst store (per catalog unit) */
  savingsVsWorstPerUnit: number;
  matchScore: number;
  matchLabel: string;
};

export type UnmatchedResult = {
  query: string;
  status: "unmatched";
  suggestions: string[];
};

export type CompareResult = MatchedResult | UnmatchedResult;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9%\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Score how well a user query matches a catalog item (0–100).
 *
 * Priority:
 * 100 exact name/alias
 * 90  name/alias starts with query
 * 80  name/alias contains query
 * 70  query contains name/alias
 * ≤60 token overlap (share of query words found in name+aliases)
 */
function scoreMatch(query: string, item: GroceryItem): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(item.name);
  const aliases = item.aliases.map(normalize);

  if (name === q || aliases.includes(q)) return 100;

  if (name.startsWith(q) || aliases.some((a) => a.startsWith(q))) return 90;

  if (name.includes(q) || aliases.some((a) => a.includes(q))) return 80;

  if (q.includes(name) || aliases.some((a) => q.includes(a) && a.length > 2)) {
    return 70;
  }

  const qTokens = q.split(" ").filter(Boolean);
  const corpus = [name, ...aliases].join(" ");
  const hitCount = qTokens.filter((t) => corpus.includes(t)).length;
  if (hitCount === 0) return 0;
  return (hitCount / qTokens.length) * 60;
}

function matchLabel(score: number): string {
  if (score >= 90) return "Exact / strong match";
  if (score >= 70) return "Close match";
  if (score >= 45) return "Fuzzy match";
  return "Weak match";
}

function findBestMatch(
  query: string,
): { item: GroceryItem; score: number } | null {
  let best: GroceryItem | null = null;
  let bestScore = 0;

  for (const item of CATALOG) {
    const score = scoreMatch(query, item);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return best && bestScore >= 45 ? { item: best, score: bestScore } : null;
}

function suggestionsFor(query: string): string[] {
  return CATALOG.map((item) => ({
    name: item.name,
    score: scoreMatch(query, item),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.name);
}

export function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function compareList(queries: string[]): CompareResult[] {
  return queries.map((query) => {
    const found = findBestMatch(query);
    if (!found) {
      return {
        query,
        status: "unmatched" as const,
        suggestions: suggestionsFor(query),
      };
    }

    const { item, score } = found;

    const prices: PriceRow[] = STORES.map((store) => {
      const shelfPrice = item.prices[store.id];
      const packQty = getPackQty(item, store.id);
      return {
        storeId: store.id,
        storeName: store.name,
        shelfPrice,
        packQty,
        unitPrice: Number((shelfPrice / packQty).toFixed(4)),
        packLabel: formatPackLabel(item, store.id),
        meta: getPriceMeta(item, store.id),
      };
    }).sort((a, b) => a.unitPrice - b.unitPrice);

    const best = prices[0];
    const worst = prices[prices.length - 1];

    return {
      query,
      status: "matched" as const,
      item,
      prices,
      bestStoreId: best.storeId,
      bestUnitPrice: best.unitPrice,
      bestShelfPrice: best.shelfPrice,
      savingsVsWorstPerUnit: Number(
        (worst.unitPrice - best.unitPrice).toFixed(2),
      ),
      matchScore: Math.round(score),
      matchLabel: matchLabel(score),
    };
  });
}

export type StoreTrip = {
  storeId: StoreId;
  storeName: string;
  location: string;
  items: MatchedResult[];
  /** Checkout total (shelf prices) */
  subtotal: number;
  liveCount: number;
};

export function buildStoreTrips(results: CompareResult[]): StoreTrip[] {
  const matched = results.filter(
    (r): r is MatchedResult => r.status === "matched",
  );

  return STORES.map((store) => {
    const items = matched.filter((r) => r.bestStoreId === store.id);
    const subtotal = items.reduce((sum, r) => sum + r.bestShelfPrice, 0);
    const liveCount = items.filter((r) => {
      const row = r.prices.find((p) => p.storeId === store.id);
      return row?.meta.source === "live";
    }).length;
    return {
      storeId: store.id,
      storeName: store.name,
      location: store.location,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      liveCount,
    };
  }).filter((trip) => trip.items.length > 0);
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function formatUnitPrice(n: number, unit: string): string {
  return `${formatMoney(n)} / ${unit}`;
}

export { scoreMatch, getUnitPrice };
