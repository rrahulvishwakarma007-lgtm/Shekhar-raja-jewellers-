// src/lib/priceStore.ts
// Manages gold rates, making charges, product weights & price overrides

export interface GoldRates {
  rate18K: number;   // ₹ per gram
  rate20K: number;
  rate22K: number;
  rate24K: number;
  makingPct: number;   // making charge % of gold value (default 12%)
  wastagePct: number;  // wastage % added to weight (default 5%)
  updatedAt: string;   // ISO date string
}

export interface ProductMeta {
  weight?: number;        // grams
  priceOverride?: number; // manual price override in ₹ (if set, ignores calculation)
}

// ── Default gold rates (Jabalpur, Aug 2026) ──────────────────────────────────
const DEFAULT_RATES: GoldRates = {
  rate18K:    11946,
  rate20K:    13274,
  rate22K:    14601,
  rate24K:    15928,
  makingPct:  12,
  wastagePct: 5,
  updatedAt:  new Date().toISOString(),
};

// ── Default weights by category (grams) ──────────────────────────────────────
export const DEFAULT_WEIGHTS: Record<string, number> = {
  bangles:     15,
  rings:        4,
  womens_ring:  3,
  mens_ring:    6,
  necklaces:   25,
  chokers:     18,
  earrings:     6,
  pendants:     5,
  bridal:      60,
  chains:      10,
  antique:     20,
};

const RATES_KEY = 'srj_gold_rates';
const META_KEY  = 'srj_product_meta';

// ── Gold rates ─────────────────────────────────────────────────────────────────
export function loadGoldRates(): GoldRates {
  try {
    const raw = localStorage.getItem(RATES_KEY);
    if (raw) return { ...DEFAULT_RATES, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_RATES };
}

export function saveGoldRates(rates: GoldRates): void {
  try {
    localStorage.setItem(RATES_KEY, JSON.stringify({ ...rates, updatedAt: new Date().toISOString() }));
  } catch {}
}

// ── Product meta (weight + price override) ────────────────────────────────────
export function loadProductMeta(): Record<string, ProductMeta> {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveProductMeta(meta: Record<string, ProductMeta>): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {}
}

// ── Price calculator ──────────────────────────────────────────────────────────
export function calcPrice(
  karat: string,
  weightG: number,
  rates: GoldRates,
  priceOverride?: number
): number {
  if (priceOverride && priceOverride > 0) return priceOverride;

  const rateMap: Record<string, number> = {
    '18K': rates.rate18K,
    '20K': rates.rate20K,
    '22K': rates.rate22K,
    '24K': rates.rate24K,
  };
  const ratePerGram = rateMap[karat] ?? rates.rate22K;

  // effectiveWeight = weight + wastage
  const effectiveWeight = weightG * (1 + rates.wastagePct / 100);

  // goldValue = effectiveWeight × ratePerGram
  const goldValue = effectiveWeight * ratePerGram;

  // making = goldValue × makingPct/100
  const making = goldValue * (rates.makingPct / 100);

  // base = goldValue + making
  const base = goldValue + making;

  // GST 3% on gold value + 5% on making
  const gst = goldValue * 0.03 + making * 0.05;

  return Math.round(base + gst);
}

export function formatPrice(amount: number): string {
  if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(2) + 'L';
  }
  return '₹' + amount.toLocaleString('en-IN');
}
