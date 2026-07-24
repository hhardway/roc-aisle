import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CITY,
  PRICE_AS_OF,
  STORES,
  ZIP,
  countLivePrices,
} from "./data/prices";
import {
  buildStoreTrips,
  compareList,
  formatMoney,
  parseList,
  type CompareResult,
  type MatchedResult,
  type PriceRow,
} from "./lib/compare";
import "./App.css";

const SAMPLE_LIST = `milk
eggs
bread
bananas
chicken breast
pasta
coffee
toilet paper`;

const STORE_CLASS: Record<string, string> = {
  walmart: "store-walmart",
  target: "store-target",
  aldi: "store-aldi",
};

function StoreBadge({ storeId, label }: { storeId: string; label: string }) {
  return (
    <span className={`store-badge ${STORE_CLASS[storeId] ?? ""}`}>{label}</span>
  );
}

function SourceBadge({ meta }: { meta: PriceRow["meta"] }) {
  if (meta.source === "live") {
    return (
      <span className="source-badge live" title={meta.label ?? "Live price"}>
        Live
      </span>
    );
  }
  return (
    <span className="source-badge estimated" title="Estimated catalog price">
      Est.
    </span>
  );
}

function ResultRow({
  result,
  index,
}: {
  result: CompareResult;
  index: number;
}) {
  if (result.status === "unmatched") {
    return (
      <motion.li
        className="result-row unmatched"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 * index, duration: 0.35 }}
      >
        <div className="result-main">
          <p className="result-query">“{result.query}”</p>
          <p className="result-meta">No match in the Rochester catalog</p>
          {result.suggestions.length > 0 && (
            <p className="result-hint">
              Try: {result.suggestions.join(" · ")}
            </p>
          )}
        </div>
      </motion.li>
    );
  }

  const matched = result as MatchedResult;
  const bestMeta = matched.prices.find(
    (p) => p.storeId === matched.bestStoreId,
  )?.meta;

  return (
    <motion.li
      className="result-row"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.35 }}
    >
      <div className="result-main">
        <p className="result-query">{matched.item.name}</p>
        <p className="result-meta">
          “{matched.query}” → {matched.matchLabel} ({matched.matchScore}) ·{" "}
          {matched.item.unit}
        </p>
        <div className="price-strip" aria-label="Prices by store">
          {matched.prices.map((p) => (
            <span
              key={p.storeId}
              className={`price-chip ${p.storeId === matched.bestStoreId ? "best" : ""}`}
              title={p.meta.label ?? undefined}
            >
              <span className="price-store-row">
                <span className="price-store">{p.storeName}</span>
                <SourceBadge meta={p.meta} />
              </span>
              <span className="price-amount">{formatMoney(p.price)}</span>
            </span>
          ))}
        </div>
        {bestMeta?.source === "live" && bestMeta.label && (
          <p className="live-note">{bestMeta.label}</p>
        )}
      </div>
      <div className="result-pick">
        <StoreBadge
          storeId={matched.bestStoreId}
          label={
            STORES.find((s) => s.id === matched.bestStoreId)?.shortName ??
            matched.bestStoreId
          }
        />
        <p className="pick-price">{formatMoney(matched.bestPrice)}</p>
        {matched.savingsVsWorst > 0 && (
          <p className="pick-save">Save {formatMoney(matched.savingsVsWorst)}</p>
        )}
      </div>
    </motion.li>
  );
}

type ViewMode = "by-item" | "by-store";

function tripToPlainText(trip: {
  storeName: string;
  location: string;
  subtotal: number;
  items: MatchedResult[];
}): string {
  const lines = [
    trip.storeName,
    trip.location,
    "",
    ...trip.items.map((item) => {
      const bestRow = item.prices.find((p) => p.storeId === item.bestStoreId);
      const tag = bestRow?.meta.source === "live" ? " [live]" : " [est.]";
      return `☐ ${item.item.name} — ${formatMoney(item.bestPrice)}${tag}`;
    }),
    "",
    `Subtotal: ${formatMoney(trip.subtotal)}`,
  ];
  return lines.join("\n");
}

function allTripsToPlainText(
  trips: ReturnType<typeof buildStoreTrips>,
  unmatched: CompareResult[],
): string {
  const blocks = trips.map(tripToPlainText);
  if (unmatched.length > 0) {
    blocks.push(
      [
        "Unmatched (add manually)",
        "",
        ...unmatched.map((r) => `☐ ${r.query}`),
      ].join("\n"),
    );
  }
  return blocks.join("\n\n———\n\n");
}

export default function App() {
  const [rawList, setRawList] = useState(SAMPLE_LIST);
  const [submitted, setSubmitted] = useState(SAMPLE_LIST);
  const [hasRun, setHasRun] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("by-store");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const results = useMemo(
    () => (hasRun ? compareList(parseList(submitted)) : []),
    [hasRun, submitted],
  );

  const trips = useMemo(() => buildStoreTrips(results), [results]);
  const matched = results.filter((r) => r.status === "matched") as MatchedResult[];
  const unmatched = results.filter((r) => r.status === "unmatched");
  const optimizedTotal = matched.reduce((sum, r) => sum + r.bestPrice, 0);
  const allAtWalmart = matched.reduce((sum, r) => sum + r.item.prices.walmart, 0);
  const allAtTarget = matched.reduce((sum, r) => sum + r.item.prices.target, 0);
  const allAtAldi = matched.reduce((sum, r) => sum + r.item.prices.aldi, 0);
  const singleStoreBest = Math.min(allAtWalmart, allAtTarget, allAtAldi);
  const multiStoreSavings = Number(
    Math.max(0, singleStoreBest - optimizedTotal).toFixed(2),
  );

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopiedKey(null);
    }
  }

  function onCompare(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(rawList);
    setHasRun(true);
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />

      <header className="hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="brand">ROC Aisle</p>
          <h1>Buy each item where Rochester is cheapest.</h1>
          <p className="lede">
            Paste your grocery list. We’ll pick Walmart, Target, or Aldi for
            every line — prices tuned to {CITY} ({ZIP}).
          </p>
        </motion.div>

        <motion.form
          className="list-panel"
          onSubmit={onCompare}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <label htmlFor="grocery-list">Your grocery list</label>
          <textarea
            id="grocery-list"
            value={rawList}
            onChange={(e) => setRawList(e.target.value)}
            placeholder="milk, eggs, bread…"
            rows={8}
          />
          <div className="list-actions">
            <button type="submit" className="cta">
              Compare prices
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => setRawList(SAMPLE_LIST)}
            >
              Load sample list
            </button>
          </div>
        </motion.form>
      </header>

      <AnimatePresence>
        {hasRun && results.length > 0 && (
          <motion.main
            className="results"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <section className="summary" aria-labelledby="summary-heading">
              <h2 id="summary-heading">Split-store plan</h2>
              <p className="section-lede">
                Shop the cheapest shelf for each item
                {multiStoreSavings > 0
                  ? ` — about ${formatMoney(multiStoreSavings)} less than one store.`
                  : "."}
              </p>

              <div className="data-quality" aria-label="Price data quality">
                <div className="data-quality-head">
                  <h3>Price validity</h3>
                  <p>
                    {countLivePrices()} live · as of {PRICE_AS_OF} · ZIP {ZIP}
                  </p>
                </div>
                <ul className="data-quality-list">
                  <li>
                    <span className="source-badge live">Live</span>
                    Aldi milk, butter, chicken — Instacart for {CITY} ({ZIP})
                  </li>
                  <li>
                    <span className="source-badge estimated">Est.</span>
                    All Walmart & Target prices, plus other Aldi items
                  </li>
                </ul>
                <p className="data-quality-note">
                  Live samples can differ by brand/size from the catalog name.
                  Treat “Est.” totals as planning guidance, not shelf guarantees.
                </p>
              </div>

              <div className="totals">
                <div className="total-block primary">
                  <span className="total-label">Optimized total</span>
                  <span className="total-value">
                    {formatMoney(optimizedTotal)}
                  </span>
                </div>
                <div className="total-block">
                  <span className="total-label">All Walmart</span>
                  <span className="total-value">
                    {formatMoney(allAtWalmart)}
                  </span>
                </div>
                <div className="total-block">
                  <span className="total-label">All Target</span>
                  <span className="total-value">
                    {formatMoney(allAtTarget)}
                  </span>
                </div>
                <div className="total-block">
                  <span className="total-label">All Aldi</span>
                  <span className="total-value">{formatMoney(allAtAldi)}</span>
                </div>
              </div>

              <div className="view-bar" role="tablist" aria-label="Result layout">
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "by-store"}
                  className={`view-tab ${viewMode === "by-store" ? "active" : ""}`}
                  onClick={() => setViewMode("by-store")}
                >
                  List by store
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "by-item"}
                  className={`view-tab ${viewMode === "by-item" ? "active" : ""}`}
                  onClick={() => setViewMode("by-item")}
                >
                  List by item
                </button>
                {viewMode === "by-store" && trips.length > 0 && (
                  <button
                    type="button"
                    className="ghost copy-all"
                    onClick={() =>
                      copyText("all", allTripsToPlainText(trips, unmatched))
                    }
                  >
                    {copiedKey === "all" ? "Copied" : "Copy all store lists"}
                  </button>
                )}
              </div>
            </section>

            {viewMode === "by-store" ? (
              <section
                className="store-lists"
                aria-labelledby="store-lists-heading"
              >
                <h2 id="store-lists-heading">Shopping lists by store</h2>
                <p className="section-lede">
                  One checklist per stop — copy what you need before you leave.
                </p>

                <div className="store-list-grid">
                  {trips.map((trip, i) => (
                    <motion.article
                      key={trip.storeId}
                      className="store-list-card"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i, duration: 0.4 }}
                    >
                      <div className="store-list-head">
                        <div>
                          <StoreBadge
                            storeId={trip.storeId}
                            label={trip.storeName}
                          />
                          <p className="trip-loc">{trip.location}</p>
                        </div>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() =>
                            copyText(trip.storeId, tripToPlainText(trip))
                          }
                        >
                          {copiedKey === trip.storeId ? "Copied" : "Copy list"}
                        </button>
                      </div>

                      <ol className="store-checklist">
                        {trip.items.map((item) => {
                          const bestRow = item.prices.find(
                            (p) => p.storeId === item.bestStoreId,
                          );
                          return (
                            <li key={item.item.id}>
                              <span className="check-name">
                                {item.item.name}
                                {bestRow && (
                                  <SourceBadge meta={bestRow.meta} />
                                )}
                              </span>
                              <span className="check-price">
                                {formatMoney(item.bestPrice)}
                              </span>
                            </li>
                          );
                        })}
                      </ol>

                      <p className="store-list-total">
                        <span>
                          Store subtotal
                          {trip.liveCount > 0
                            ? ` · ${trip.liveCount} live`
                            : " · all estimated"}
                        </span>
                        <strong>{formatMoney(trip.subtotal)}</strong>
                      </p>
                    </motion.article>
                  ))}
                </div>

                {unmatched.length > 0 && (
                  <div className="unmatched-block">
                    <h3>Unmatched items</h3>
                    <p className="section-lede">
                      Not in the catalog yet — add these manually wherever you
                      shop.
                    </p>
                    <ul className="unmatched-list">
                      {unmatched.map((r) => (
                        <li key={r.query}>{r.query}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ) : (
              <section className="item-results" aria-labelledby="items-heading">
                <h2 id="items-heading">Where to buy each item</h2>
                <p className="section-lede">
                  Green marks the lowest price. Each chip shows whether that
                  store’s number is <span className="source-badge live">Live</span>{" "}
                  or <span className="source-badge estimated">Est.</span>
                </p>
                <ul className="result-list">
                  {results.map((result, i) => (
                    <ResultRow
                      key={`${result.query}-${i}`}
                      result={result}
                      index={i}
                    />
                  ))}
                </ul>
              </section>
            )}

            <p className="footnote">
              Matching uses alias + fuzzy scoring in{" "}
              <code>src/lib/compare.ts</code> (exact → prefix → contains → token
              overlap; needs score ≥ 45). Price sources live in{" "}
              <code>src/data/prices.ts</code>.
            </p>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
