import { API_BASE_URL } from './config';


export const groupAPI = {
  createGroup: async (token, groupData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create group');
      return data;
    } catch (error) { throw error; }
  },

  getGroupsByEvent: async (token, eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/event/${eventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch groups');
      return data;
    } catch (error) { throw error; }
  },

  updateGroupMetadata: async (token, groupId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update group');
      return data;
    } catch (error) { throw error; }
  }
};

export default groupAPI;
