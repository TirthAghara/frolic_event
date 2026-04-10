import { API_BASE_URL } from './config';


export const instituteAPI = {
  // Create institute
  createInstitute: async (token, instituteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/institutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(instituteData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create institute');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all institutes
  getInstitutes: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/institutes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch institutes');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get institute by ID
  getInstituteById: async (token, instituteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/institutes/${instituteId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch institute');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update institute
  updateInstitute: async (token, instituteId, instituteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/institutes/${instituteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(instituteData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update institute');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete institute
  deleteInstitute: async (token, instituteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/institutes/${instituteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete institute');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default instituteAPI;
