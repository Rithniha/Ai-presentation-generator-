import { api } from './api';

// Generate or retrieve persistent guest session uuid
export const getGuestSessionId = () => {
  let sessionId = localStorage.getItem('guestSessionId');
  if (!sessionId) {
    // Generate simple standard random identifier
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guestSessionId', sessionId);
  }
  return sessionId;
};

export const authService = {
  // Register a user
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.user;
  },

  // Login a user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.user;
  },

  // Get current logged user profile
  getMe: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.user;
    } catch (error) {
      // Return null when session is expired or not authenticated
      return null;
    }
  },

  // Logout current user
  logout: async () => {
    await api.post('/api/auth/logout');
  }
};
