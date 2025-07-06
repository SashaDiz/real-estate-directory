import { withRelatedProject } from '@vercel/related-projects';

// Get the API host dynamically for Vercel deployments
const getApiHost = () => {
  try {
    // Try to use Vercel related projects first
    return withRelatedProject({
      projectName: 'realestate-backend', // Replace with your actual backend project name
      defaultHost: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    });
  } catch (error) {
    // Fallback to environment variable or localhost
    console.warn('Could not resolve related project, using fallback:', error);
    return import.meta.env.VITE_API_URL || 'http://localhost:4000';
  }
};

// Base API URL
export const API_BASE_URL = getApiHost();

// API endpoints
export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/api/properties`,
  uploadImages: `${API_BASE_URL}/api/upload-images`,
  deleteImage: (filename) => `${API_BASE_URL}/api/delete-image/${filename}`,
  propertyView: (id) => `${API_BASE_URL}/api/properties/${id}/view`,
  propertyContact: (id) => `${API_BASE_URL}/api/properties/${id}/contact-request`,
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
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