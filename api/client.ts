import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

console.log('API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    return Promise.reject(error);
  }
);

export const groupApi = {
  createGroup: async (userId: string, name?: string) => {
    console.log('Creating group with:', { userId, name });
    const response = await apiClient.post('/groups', { userId, name });
    return response.data;
  },

  joinGroup: async (groupId: string, userId: string) => {
    console.log('Joining group:', { groupId, userId });
    const response = await apiClient.post(`/groups/${groupId}/join`, { userId });
    return response.data;
  },

  getGroup: async (groupId: string) => {
    console.log('Getting group:', { groupId });
    const response = await apiClient.get(`/groups/${groupId}`);
    return response.data;
  },

  leaveGroup: async (groupId: string, userId: string) => {
    console.log('Leaving group:', { groupId, userId });
    await apiClient.patch(`/groups/${groupId}/leave`);
  },

  // Add user-related functions to groupApi
  getUser: async (userId: string) => {
    console.log('Getting user:', { userId });
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateCurrency: async (userId: string, amount: number) => {
    console.log('Updating currency:', { userId, amount });
    const response = await apiClient.patch(`/users/${userId}/currency`, { amount });
    return response.data;
  },
}; 