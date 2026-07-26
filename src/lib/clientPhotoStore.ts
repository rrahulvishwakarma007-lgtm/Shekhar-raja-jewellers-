// ════════════════════════════════════════════════════════════════════════════
// src/lib/clientPhotoStore.ts
//
// Stores client jewellery items in:
//   • Supabase Storage  → photos (permanent cloud, any device)
//   • Supabase Database → item metadata (name, weight, carat, material, note)
//
// Setup required (one-time, see README below):
//   1. Create bucket "catalogue-photos" in Supabase Storage
//   2. Create table "client_catalogue_items" in Supabase
//   3. Add your Supabase URL + anon key to .env
// ════════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

// ── Supabase client ───────────────────────────────────────────────────────────
// Add these to your .env file (Vercel env vars too):
//   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=your_anon_key_here
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const BUCKET = 'catalogue-photos';   // Storage bucket name
const TABLE  = 'client_catalogue_items'; // DB table name

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ClientItem {
  id:        string;
  name:      string;
  weight:    string;
  carat:     string;
  material:  string;
  note:      string;
  imageUrl:  string;   // public URL from Supabase Storage
  imagePath: string;   // storage path (for deletion)
  addedAt:   number;
  token?:    string;   // catalogue token (to scope items per client)
}

// ── Get catalogue token from URL (scopes items per client link) ───────────────
function getToken(): string {
  return new URLSearchParams(window.location.search).get('token') ?? 'default';
}

// ══════════════════════════════════════════════════════════════════════════════
// PHOTO UPLOAD — Upload base64 image to Supabase Storage
// Returns: { publicUrl, path } or throws
// ══════════════════════════════════════════════════════════════════════════════
export async function uploadPhoto(base64DataUrl: string): Promise<{ publicUrl: string; path: string }> {
  // Convert base64 to Blob
  const response  = await fetch(base64DataUrl);
  const blob      = await response.blob();
  const ext       = blob.type.includes('png') ? 'png' : 'jpg';
  const path      = `${getToken()}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type,
      upsert:      false,
      cacheControl: '31536000', // 1 year cache
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

// ══════════════════════════════════════════════════════════════════════════════
// LOAD ALL ITEMS — from Supabase DB for this catalogue token
// ══════════════════════════════════════════════════════════════════════════════
export async function loadClientItems(): Promise<ClientItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('token', getToken())
      .order('added_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map(row => ({
      id:        row.id,
      name:      row.name,
      weight:    row.weight  ?? '',
      carat:     row.carat   ?? '',
      material:  row.material ?? '',
      note:      row.note    ?? '',
      imageUrl:  row.image_url,
      imagePath: row.image_path,
      addedAt:   new Date(row.added_at).getTime(),
      token:     row.token,
    }));
  } catch (e) {
    console.warn('Supabase load failed, using IndexedDB fallback', e);
    return idbLoad();
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// SAVE ONE ITEM — Upload photo + insert row to DB
// ══════════════════════════════════════════════════════════════════════════════
export async function saveClientItem(item: Omit<ClientItem, 'imageUrl' | 'imagePath'> & { base64: string }): Promise<ClientItem> {
  try {
    // 1. Upload photo to Supabase Storage
    const { publicUrl, path } = await uploadPhoto(item.base64);

    // 2. Insert metadata to DB
    const row = {
      id:         item.id,
      name:       item.name,
      weight:     item.weight,
      carat:      item.carat,
      material:   item.material,
      note:       item.note,
      image_url:  publicUrl,
      image_path: path,
      added_at:   new Date(item.addedAt).toISOString(),
      token:      getToken(),
    };

    const { error } = await supabase.from(TABLE).insert(row);
    if (error) throw error;

    const saved: ClientItem = {
      ...item,
      imageUrl:  publicUrl,
      imagePath: path,
      token:     getToken(),
    };

    // Also save to IndexedDB as offline cache
    await idbSave({ ...saved, imageUrl: publicUrl });

    return saved;
  } catch (e) {
    console.warn('Supabase save failed, saving to IndexedDB only', e);
    // Fallback: save base64 directly to IndexedDB
    const fallback: ClientItem = {
      ...item,
      imageUrl:  item.base64,
      imagePath: '',
    };
    await idbSave(fallback);
    return fallback;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// DELETE ONE ITEM — Remove from Storage + DB + IndexedDB cache
// ══════════════════════════════════════════════════════════════════════════════
export async function deleteClientItem(id: string, imagePath?: string): Promise<void> {
  try {
    // 1. Delete photo from Storage (if path available)
    if (imagePath) {
      await supabase.storage.from(BUCKET).remove([imagePath]);
    }
    // 2. Delete row from DB
    await supabase.from(TABLE).delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete failed', e);
  }
  // 3. Always remove from IndexedDB cache too
  await idbDelete(id);
}

// ══════════════════════════════════════════════════════════════════════════════
// INDEXEDDB FALLBACK — Used when Supabase is unreachable (offline)
// ══════════════════════════════════════════════════════════════════════════════
const DB_NAME = 'srj_catalogue_offline';
const DB_VER  = 1;
const STORE   = 'client_items';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function idbLoad(): Promise<ClientItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result as ClientItem[]).sort((a,b) => b.addedAt - a.addedAt));
      req.onerror   = () => reject(req.error);
    });
  } catch { return []; }
}

async function idbSave(item: ClientItem): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(item);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  } catch {}
}

async function idbDelete(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  } catch {}
}

// ── Migrate old localStorage items to Supabase ────────────────────────────────
export async function migrateFromLocalStorage(): Promise<void> {
  const OLD_KEY = 'srj_client_items';
  try {
    const raw = localStorage.getItem(OLD_KEY);
    if (!raw) return;
    const items = JSON.parse(raw) as any[];
    if (!items.length) return;
    for (const item of items) {
      if (item.imageUrl?.startsWith('data:')) {
        await saveClientItem({ ...item, base64: item.imageUrl });
      }
    }
    localStorage.removeItem(OLD_KEY);
    console.log('Migrated', items.length, 'items from localStorage to Supabase');
  } catch {}
}
