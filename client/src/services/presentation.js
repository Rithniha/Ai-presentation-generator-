import { api } from './api';
import { getGuestSessionId } from './auth';

export const presentationService = {
  // Get all presentations
  getAll: async () => {
    // If we're authenticated, the backend uses our JWT cookie.
    // If not, we pass the guestSessionId in the query.
    const guestSessionId = getGuestSessionId();
    const response = await api.get(`/api/presentations?guestSessionId=${guestSessionId}`);
    return response.data; // The array of presentations
  },

  // Get a single presentation by ID
  getById: async (id) => {
    const guestSessionId = getGuestSessionId();
    const response = await api.get(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
    return response.data;
  },

  // Create a new presentation
  create: async (data) => {
    const guestSessionId = getGuestSessionId();
    const response = await api.post('/api/presentations', { ...data, guestSessionId });
    return response.data;
  },

  // Update a presentation
  update: async (id, data) => {
    const guestSessionId = getGuestSessionId();
    const response = await api.put(`/api/presentations/${id}`, { ...data, guestSessionId });
    return response.data;
  },

  // Delete a presentation
  delete: async (id) => {
    const guestSessionId = getGuestSessionId();
    const response = await api.delete(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
    return response;
  }
};
