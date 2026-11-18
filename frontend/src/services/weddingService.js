/**
 * Wedding profile service.
 * Connects to FastAPI backend at /api/couples with graceful localStorage fallback.
 */

import { apiRequest } from './apiClient';
import { sampleCouple } from '../data/sampleData';

const PROFILE_KEY = 'weddwish_wedding_profile';

function mapFromBackend(data) {
  if (!data) return null;
  return {
    partner1: data.partner_one_name,
    partner2: data.partner_two_name,
    weddingDate: data.wedding_date,
    location: data.venue,
    description: data.story,
    slug: data.slug,
    photo: data.photo || null,
  };
}

function mapToBackend(data) {
  return {
    partner_one_name: data.partner1,
    partner_two_name: data.partner2,
    wedding_date: data.weddingDate,
    venue: data.location,
    story: data.description || '',
    slug: data.slug,
    photo: data.photo && data.photo.startsWith('http') ? data.photo : null,
  };
}

export async function getWeddingProfile(userId) {
  try {
    const data = await apiRequest('/api/couples/me');
    const profile = mapFromBackend(data);
    if (profile) {
      // Sync local cache
      const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
      profiles[userId] = profile;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
      return profile;
    }
  } catch (err) {
    // 404 means user hasn't created a profile yet, or network error
  }

  // Fallback to local storage or sample data
  const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  return profiles[userId] || sampleCouple;
}

export async function saveWeddingProfile(userId, profileData) {
  const backendPayload = mapToBackend(profileData);

  try {
    let result;
    try {
      // Try updating existing profile first
      result = await apiRequest('/api/couples/me', {
        method: 'PUT',
        body: JSON.stringify(backendPayload),
      });
    } catch (putError) {
      if (putError.status === 404) {
        // If not found, create new profile
        result = await apiRequest('/api/couples', {
          method: 'POST',
          body: JSON.stringify(backendPayload),
        });
      } else {
        throw putError;
      }
    }

    const saved = mapFromBackend(result);
    const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    profiles[userId] = { ...saved, userId, updatedAt: new Date().toISOString() };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
    return profiles[userId];
  } catch (apiError) {
    // Local storage fallback
    const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    profiles[userId] = { ...profileData, userId, updatedAt: new Date().toISOString() };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
    return profiles[userId];
  }
}

export async function getPublicWedding(slug) {
  try {
    const data = await apiRequest(`/api/couples/${slug.toLowerCase()}`);
    return mapFromBackend(data);
  } catch (err) {
    // Check stored profiles or sample fallback
    const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    const stored = Object.values(profiles).find((p) => p.slug === slug);
    if (stored) return stored;
    if (slug === sampleCouple.slug) return sampleCouple;
    return null;
  }
}
