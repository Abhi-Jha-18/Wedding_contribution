/**
 * Wishlist + contribution service – localStorage backed.
 * Will be replaced by FastAPI endpoints in the next milestone.
 */
import { sampleWishlistItems, sampleContributions } from '../data/sampleData';

const ITEMS_KEY = 'weddwish_wishlist_items';
const CONTRIBS_KEY = 'weddwish_contributions';

/* ── helpers ─────────────────────────────────────────── */
function readItems() {
  const raw = localStorage.getItem(ITEMS_KEY);
  return raw ? JSON.parse(raw) : null; // null = not initialised yet
}
function writeItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}
function readContribs() {
  const raw = localStorage.getItem(CONTRIBS_KEY);
  return raw ? JSON.parse(raw) : null;
}
function writeContribs(contribs) {
  localStorage.setItem(CONTRIBS_KEY, JSON.stringify(contribs));
}

/* ── API-shaped functions ────────────────────────────── */

export async function getWishlistItems(coupleId) {
  await new Promise((r) => setTimeout(r, 200));
  let items = readItems();
  if (!items) {
    // first run — seed with sample data
    items = sampleWishlistItems;
    writeItems(items);
  }
  return items.filter((i) => i.coupleId === coupleId);
}

export async function addWishlistItem(coupleId, item) {
  await new Promise((r) => setTimeout(r, 300));
  const items = readItems() || [];
  const newItem = {
    ...item,
    id: 'w' + Date.now(),
    coupleId,
    currentAmount: 0,
    image: item.image || null,
  };
  items.push(newItem);
  writeItems(items);
  return newItem;
}

export async function updateWishlistItem(coupleId, itemId, updates) {
  await new Promise((r) => setTimeout(r, 300));
  const items = readItems() || [];
  const idx = items.findIndex((i) => i.id === itemId && i.coupleId === coupleId);
  if (idx === -1) throw new Error('Item not found');
  items[idx] = { ...items[idx], ...updates };
  writeItems(items);
  return items[idx];
}

export async function deleteWishlistItem(coupleId, itemId) {
  await new Promise((r) => setTimeout(r, 300));
  let items = readItems() || [];
  items = items.filter((i) => !(i.id === itemId && i.coupleId === coupleId));
  writeItems(items);
}

export async function getContributions(_coupleId) {
  await new Promise((r) => setTimeout(r, 200));
  let contribs = readContribs();
  if (!contribs) {
    contribs = sampleContributions;
    writeContribs(contribs);
  }
  return contribs;
}

export async function addContribution(contribution) {
  await new Promise((r) => setTimeout(r, 400));
  const contribs = readContribs() || [];
  const newContrib = {
    ...contribution,
    id: 'c' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  contribs.push(newContrib);
  writeContribs(contribs);

  // Also update the item's currentAmount
  const items = readItems() || [];
  const item = items.find((i) => i.id === contribution.wishlistItemId);
  if (item) {
    item.currentAmount = (item.currentAmount || 0) + contribution.amount;
    writeItems(items);
  }

  return newContrib;
}
