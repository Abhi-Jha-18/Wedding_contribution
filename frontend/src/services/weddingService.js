/**
 * Wedding profile service – localStorage backed.
 * Will be replaced by FastAPI endpoints in the next milestone.
 */
import { sampleCouple } from '../data/sampleData';

const PROFILE_KEY = 'weddwish_wedding_profile';

export async function getWeddingProfile(userId) {
  await new Promise((r) => setTimeout(r, 300));
  const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  return profiles[userId] || null;
}

export async function saveWeddingProfile(userId, profileData) {
  await new Promise((r) => setTimeout(r, 400));
  const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  profiles[userId] = { ...profileData, userId, updatedAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
  return profiles[userId];
}

export async function getPublicWedding(slug) {
  await new Promise((r) => setTimeout(r, 300));
  // Check stored profiles first
  const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  const stored = Object.values(profiles).find((p) => p.slug === slug);
  if (stored) return stored;
  // Fallback to sample data
  if (slug === sampleCouple.slug) return sampleCouple;
  return null;
}
