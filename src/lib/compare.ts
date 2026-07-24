import {
  CATALOG,
  STORES,
  type GroceryItem,
  type StoreId,
} from "../data/prices";

export type PriceRow = {
  storeId: StoreId;
  storeName: string;
  price: number;
};

export type MatchedResult = {
  query: string;
  status: "matched";
  item: GroceryItem;
  prices: PriceRow[];
  bestStoreId: StoreId;
  bestPrice: number;
  savingsVsWorst: number;
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

function findBestMatch(query: string): GroceryItem | null {
  let best: GroceryItem | null = null;
  let bestScore = 0;

  for (const item of CATALOG) {
    const score = scoreMatch(query, item);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore >= 45 ? best : null;
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
    const item = findBestMatch(query);
    if (!item) {
      return {
        query,
        status: "unmatched" as const,
        suggestions: suggestionsFor(query),
      };
    }

    const prices: PriceRow[] = STORES.map((store) => ({
      storeId: store.id,
      storeName: store.name,
      price: item.prices[store.id],
    })).sort((a, b) => a.price - b.price);

    const best = prices[0];
    const worst = prices[prices.length - 1];

    return {
      query,
      status: "matched" as const,
      item,
      prices,
      bestStoreId: best.storeId,
      bestPrice: best.price,
      savingsVsWorst: Number((worst.price - best.price).toFixed(2)),
    };
  });
}

export type StoreTrip = {
  storeId: StoreId;
  storeName: string;
  location: string;
  items: MatchedResult[];
  subtotal: number;
};

export function buildStoreTrips(results: CompareResult[]): StoreTrip[] {
  const matched = results.filter(
    (r): r is MatchedResult => r.status === "matched",
  );

  return STORES.map((store) => {
    const items = matched.filter((r) => r.bestStoreId === store.id);
    const subtotal = items.reduce((sum, r) => sum + r.bestPrice, 0);
    return {
      storeId: store.id,
      storeName: store.name,
      location: store.location,
      items,
      subtotal: Number(subtotal.toFixed(2)),
    };
  }).filter((trip) => trip.items.length > 0);
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}
