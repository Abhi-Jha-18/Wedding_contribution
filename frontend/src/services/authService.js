/**
 * Demo-only authentication service.
 * Uses localStorage to simulate user registration & login.
 * Will be replaced by FastAPI endpoints in the next milestone.
 */

const USERS_KEY = 'weddwish_users';
const SESSION_KEY = 'weddwish_current_user';

// Seed a demo user on first load
function seedDemoUser() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!users.find((u) => u.email === 'demo@weddwish.com')) {
    users.push({
      id: '1',
      name: 'Arjun Mehta',
      email: 'demo@weddwish.com',
      password: 'Demo1234', // plaintext for demo only
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
seedDemoUser();

export async function login(email, password) {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, user: null, token: null, message: 'Invalid email or password' };
  const session = { id: user.id, name: user.name, email: user.email, token: 'demo-token-' + user.id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session, token: session.token, message: 'Login successful' };
}

export async function register({ name, email, password }) {
  await new Promise((r) => setTimeout(r, 600));
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.find((u) => u.email === email)) {
    return { success: false, user: null, message: 'An account with this email already exists' };
  }
  const newUser = { id: String(Date.now()), name, email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const session = { id: newUser.id, name: newUser.name, email: newUser.email, token: 'demo-token-' + newUser.id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session, message: 'Registration successful' };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
