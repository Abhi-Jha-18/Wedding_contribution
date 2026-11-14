import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as weddingService from '../services/weddingService';
import * as wishlistService from '../services/wishlistService';
import { sampleCouple, sampleGuestWishes, sampleActivities } from '../data/sampleData';

const WeddingContext = createContext(null);

const WISHES_KEY = 'weddwish_guest_wishes';
const ACTIVITIES_KEY = 'weddwish_activities';

export function WeddingProvider({ children }) {
  const { user } = useAuth();
  const coupleId = user?.id || '1';

  const [weddingProfile, setWeddingProfile] = useState(() => {
    const saved = localStorage.getItem('weddwish_wedding_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed[coupleId] || sampleCouple;
    }
    return sampleCouple;
  });

  const [wishlistItems, setWishlistItems] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [guestWishes, setGuestWishes] = useState(() => {
    const saved = localStorage.getItem(WISHES_KEY);
    return saved ? JSON.parse(saved) : sampleGuestWishes;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem(ACTIVITIES_KEY);
    return saved ? JSON.parse(saved) : sampleActivities;
  });
  const [loading, setLoading] = useState(true);

  // Load wishlist and contributions
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const items = await wishlistService.getWishlistItems(coupleId);
        const contribs = await wishlistService.getContributions(coupleId);
        setWishlistItems(items);
        setContributions(contribs);
      } catch (err) {
        console.error('Failed to load wedding data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [coupleId]);

  // Log activity helper
  const addActivity = (type, description, amount = null) => {
    const newActivity = {
      id: 'a' + Date.now(),
      type,
      description,
      timestamp: new Date().toISOString(),
      amount,
    };
    setActivities((prev) => {
      const updated = [newActivity, ...prev];
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const saveProfile = async (profileData) => {
    const saved = await weddingService.saveWeddingProfile(coupleId, profileData);
    setWeddingProfile(saved);
    addActivity('profile_update', 'Wedding profile details updated');
    return saved;
  };

  const addItem = async (item) => {
    const newItem = await wishlistService.addWishlistItem(coupleId, item);
    setWishlistItems((prev) => [...prev, newItem]);
    addActivity('item_added', `Added "${newItem.title}" to wishlist`);
    return newItem;
  };

  const updateItem = async (itemId, updates) => {
    const updated = await wishlistService.updateWishlistItem(coupleId, itemId, updates);
    setWishlistItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    addActivity('item_added', `Updated wishlist goal: "${updated.title}"`);
    return updated;
  };

  const deleteItem = async (itemId) => {
    const itemToDelete = wishlistItems.find((i) => i.id === itemId);
    await wishlistService.deleteWishlistItem(coupleId, itemId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    if (itemToDelete) {
      addActivity('item_added', `Removed "${itemToDelete.title}" from wishlist`);
    }
  };

  const addContribution = async (contributionData) => {
    const newContrib = await wishlistService.addContribution(contributionData);
    setContributions((prev) => [newContrib, ...prev]);

    // Update local item amount
    setWishlistItems((prev) =>
      prev.map((item) => {
        if (item.id === contributionData.wishlistItemId) {
          return {
            ...item,
            currentAmount: (item.currentAmount || 0) + Number(contributionData.amount),
          };
        }
        return item;
      })
    );

    const targetItem = wishlistItems.find((i) => i.id === contributionData.wishlistItemId);
    const itemTitle = targetItem ? targetItem.title : 'wishlist';
    addActivity(
      'contribution',
      `${contributionData.guestName || 'A generous guest'} contributed ₹${Number(contributionData.amount).toLocaleString('en-IN')} toward ${itemTitle}`,
      Number(contributionData.amount)
    );

    return newContrib;
  };

  const addGuestWish = (wishData) => {
    const newWish = {
      id: 'gw' + Date.now(),
      guestName: wishData.guestName || 'Well-wisher',
      message: wishData.message,
      createdAt: new Date().toISOString(),
    };
    setGuestWishes((prev) => {
      const updated = [newWish, ...prev];
      localStorage.setItem(WISHES_KEY, JSON.stringify(updated));
      return updated;
    });
    addActivity('wish', `${newWish.guestName} sent warm wedding wishes`);
    return newWish;
  };

  const value = {
    weddingProfile,
    wishlistItems,
    contributions,
    activities,
    guestWishes,
    loading,
    saveProfile,
    addItem,
    updateItem,
    deleteItem,
    addContribution,
    addGuestWish,
  };

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
