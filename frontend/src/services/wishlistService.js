/**
 * Wishlist, contributions and guestbook service.
 * Connects to FastAPI backend with graceful localStorage fallback.
 */

import { apiRequest } from './apiClient';
import { sampleWishlistItems, sampleContributions } from '../data/sampleData';

const ITEMS_KEY = 'weddwish_wishlist_items';
const CONTRIBS_KEY = 'weddwish_contributions';

function mapItemFromBackend(item, coupleId) {
  return {
    id: String(item.id),
    coupleId: coupleId || '1',
    title: item.title,
    description: item.description || '',
    targetAmount: item.target_amount != null ? item.target_amount : (item.target_amount_paise ? item.target_amount_paise / 100 : 0),
    currentAmount: item.current_amount != null ? item.current_amount : (item.current_amount_paise ? item.current_amount_paise / 100 : 0),
    category: item.category || 'Other',
    image: null,
    isActive: item.is_active,
  };
}

/* ── Local storage helpers for fallback ──────────────── */
function readLocalItems() {
  const raw = localStorage.getItem(ITEMS_KEY);
  return raw ? JSON.parse(raw) : null;
}
function writeLocalItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}
function readLocalContribs() {
  const raw = localStorage.getItem(CONTRIBS_KEY);
  return raw ? JSON.parse(raw) : null;
}
function writeLocalContribs(contribs) {
  localStorage.setItem(CONTRIBS_KEY, JSON.stringify(contribs));
}

/* ── Wishlist Items API ──────────────────────────────── */

export async function getWishlistItems(coupleId) {
  try {
    const data = await apiRequest('/api/wishlists/me/items');
    if (Array.isArray(data)) {
      const items = data.map((item) => mapItemFromBackend(item, coupleId));
      writeLocalItems(items);
      return items;
    }
  } catch (err) {
    // Offline / fallback
  }

  let items = readLocalItems();
  if (!items) {
    items = sampleWishlistItems;
    writeLocalItems(items);
  }
  return items.filter((i) => i.coupleId === coupleId);
}

export async function getPublicWishlistItems(slug) {
  try {
    const data = await apiRequest(`/api/couples/${slug.toLowerCase()}/wishlist`);
    if (Array.isArray(data)) {
      return data.map((item) => mapItemFromBackend(item, '1'));
    }
  } catch (err) {
    // fallback to local items
  }
  return readLocalItems() || sampleWishlistItems;
}

export async function addWishlistItem(coupleId, item) {
  try {
    const payload = {
      title: item.title,
      description: item.description || '',
      target_amount: Number(item.targetAmount),
      category: item.category || 'Other',
    };
    const data = await apiRequest('/api/wishlists/me/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapItemFromBackend(data, coupleId);
  } catch (err) {
    // Fallback
    const items = readLocalItems() || [];
    const newItem = {
      ...item,
      id: 'w' + Date.now(),
      coupleId,
      currentAmount: 0,
      image: item.image || null,
    };
    items.push(newItem);
    writeLocalItems(items);
    return newItem;
  }
}

export async function updateWishlistItem(coupleId, itemId, updates) {
  try {
    const numericId = Number(itemId);
    if (!isNaN(numericId)) {
      const payload = {
        title: updates.title,
        description: updates.description,
        target_amount: updates.targetAmount ? Number(updates.targetAmount) : undefined,
        category: updates.category,
      };
      const data = await apiRequest(`/api/wishlists/me/items/${numericId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return mapItemFromBackend(data, coupleId);
    }
  } catch (err) {
    // Fallback
  }

  const items = readLocalItems() || [];
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx === -1) throw new Error('Item not found');
  items[idx] = { ...items[idx], ...updates };
  writeLocalItems(items);
  return items[idx];
}

export async function deleteWishlistItem(coupleId, itemId) {
  try {
    const numericId = Number(itemId);
    if (!isNaN(numericId)) {
      await apiRequest(`/api/wishlists/me/items/${numericId}`, {
        method: 'DELETE',
      });
    }
  } catch (err) {
    // Fallback
  }

  let items = readLocalItems() || [];
  items = items.filter((i) => i.id !== itemId);
  writeLocalItems(items);
}

/* ── Contributions API ───────────────────────────────── */

export async function getContributions(coupleId) {
  try {
    const data = await apiRequest('/api/contributions/me');
    if (Array.isArray(data)) {
      return data.map((c) => ({
        id: String(c.id),
        wishlistItemId: String(c.wishlist_item_id),
        guestName: c.contributor_name || 'Anonymous Guest',
        amount: c.amount,
        message: c.message,
        createdAt: c.created_at,
        itemTitle: c.item_title,
      }));
    }
  } catch (err) {
    // Fallback
  }

  let contribs = readLocalContribs();
  if (!contribs) {
    contribs = sampleContributions;
    writeLocalContribs(contribs);
  }
  return contribs;
}

export async function addContribution(contribution) {
  try {
    const numericItemId = Number(contribution.wishlistItemId);
    if (!isNaN(numericItemId)) {
      const payload = {
        contributor_name: contribution.guestName,
        amount: Number(contribution.amount),
        message: contribution.message,
        payment_mode: 'DEMO',
      };
      const data = await apiRequest(`/api/wishlist-items/${numericItemId}/contribute`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return {
        id: String(data.id),
        wishlistItemId: String(data.wishlist_item_id),
        guestName: data.contributor_name,
        amount: data.amount,
        message: data.message,
        createdAt: data.created_at,
      };
    }
  } catch (err) {
    // Fallback
  }

  const contribs = readLocalContribs() || [];
  const newContrib = {
    ...contribution,
    id: 'c' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  contribs.push(newContrib);
  writeLocalContribs(contribs);

  // Update item local total
  const items = readLocalItems() || [];
  const item = items.find((i) => i.id === contribution.wishlistItemId);
  if (item) {
    item.currentAmount = (item.currentAmount || 0) + Number(contribution.amount);
    writeLocalItems(items);
  }

  return newContrib;
}

/* ── Guestbook Wishes API ────────────────────────────── */

export async function getGuestWishes(slug) {
  try {
    const data = await apiRequest(`/api/couples/${slug.toLowerCase()}/messages`);
    if (Array.isArray(data)) {
      return data.map((m) => ({
        id: String(m.id),
        guestName: m.guest_name,
        message: m.message,
        createdAt: m.created_at,
      }));
    }
  } catch (err) {
    // Fallback
  }
  return [];
}

export async function postGuestWish(slug, wishData) {
  try {
    const payload = {
      guest_name: wishData.guestName || 'Well-Wisher',
      message: wishData.message,
    };
    const data = await apiRequest(`/api/couples/${slug.toLowerCase()}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      id: String(data.id),
      guestName: data.guest_name,
      message: data.message,
      createdAt: data.created_at,
    };
  } catch (err) {
    return {
      id: 'gw' + Date.now(),
      guestName: wishData.guestName || 'Well-Wisher',
      message: wishData.message,
      createdAt: new Date().toISOString(),
    };
  }
}
