// Simple API URL utility
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// API endpoints
export const API_ENDPOINTS = {
  properties: `${API_URL}/properties`,
  uploadImages: `${API_URL}/upload-images`,
  deleteImage: (filename) => `${API_URL}/delete-image/${filename}`,
  propertyView: (id) => `${API_URL}/properties/${id}/view`,
  propertyContact: (id) => `${API_URL}/properties/${id}/contact-request`,
  login: `${API_URL}/login`,
  register: `${API_URL}/register`,
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}; 