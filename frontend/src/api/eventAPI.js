import { API_BASE_URL } from './config';


export const eventAPI = {
  // Create event
  createEvent: async (token, eventData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all events
  getEvents: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (token, eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update event
  updateEvent: async (token, eventId, eventData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update event');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (token, eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete event');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default eventAPI;
