/**
 * Authentication service.
 * Connects to FastAPI backend at /api/auth with graceful localStorage fallback.
 */

import { apiRequest, setAuthToken } from './apiClient';

const USERS_KEY = 'weddwish_users';
const SESSION_KEY = 'weddwish_current_user';

// Seed demo user for offline / mock testing
function seedDemoUser() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.find((u) => u.email === 'demo@weddwish.com')) {
      users.push({
        id: '1',
        name: 'Arjun Mehta',
        email: 'demo@weddwish.com',
        password: 'Demo1234',
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } catch {
    // ignore
  }
}
seedDemoUser();

export async function login(email, password) {
  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    setAuthToken(data.access_token);
    const session = {
      id: String(data.user.id),
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.access_token,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session, token: data.access_token, message: 'Login successful' };
  } catch (apiError) {
    // If backend network error, fallback to local demo account
    if (apiError.status === 401 || apiError.status === 422) {
      return { success: false, user: null, token: null, message: apiError.message || 'Invalid email or password' };
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return { success: false, user: null, token: null, message: 'Invalid email or password' };

    const session = { id: user.id, name: user.name, email: user.email, token: 'demo-token-' + user.id };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session, token: session.token, message: 'Login successful (offline mode)' };
  }
}

export async function register({ name, email, password }) {
  try {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
    });

    // Auto-login after registration
    return await login(email, password);
  } catch (apiError) {
    if (apiError.status === 409) {
      return { success: false, user: null, message: 'An account with this email already exists' };
    }
    if (apiError.status === 422) {
      return { success: false, user: null, message: apiError.message || 'Validation error' };
    }

    // Local fallback
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u) => u.email === email)) {
      return { success: false, user: null, message: 'An account with this email already exists' };
    }
    const newUser = { id: String(Date.now()), name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, token: 'demo-token-' + newUser.id };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session, message: 'Registration successful (offline mode)' };
  }
}

export function logout() {
  setAuthToken(null);
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
