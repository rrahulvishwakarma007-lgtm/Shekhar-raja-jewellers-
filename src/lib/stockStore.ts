// ─── stockStore.ts ────────────────────────────────────────────────────────────
// Shared localStorage-backed stock state used by CatalogueAdmin + PrivateCatalogue
// Key: product id  →  'ready' | 'ordered'

const STORAGE_KEY = 'srj_stock_status';

export type StockStatus = 'ready' | 'ordered';

export function loadStockMap(): Record<string, StockStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStockMap(map: Record<string, StockStatus>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function setProductStatus(id: string, status: StockStatus): void {
  const map = loadStockMap();
  map[id] = status;
  saveStockMap(map);
}

export function getProductStatus(id: string): StockStatus {
  const map = loadStockMap();
  // Default: all products start as 'ready'
  return map[id] ?? 'ready';
}

export function moveToOrdered(id: string): void {
  setProductStatus(id, 'ordered');
}

export function resetToReady(id: string): void {
  setProductStatus(id, 'ready');
}
