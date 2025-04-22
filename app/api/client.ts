import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const groupApi = {
  createGroup: async (userId: number, name?: string) => {
    const response = await apiClient.post('/groups', { userId, name });
    return response.data;
  },

  joinGroup: async (groupId: string, userId: number) => {
    const response = await apiClient.post(`/groups/${groupId}/join`, { userId });
    return response.data;
  },

  getGroup: async (groupId: string) => {
    const response = await apiClient.get(`/groups/${groupId}`);
    return response.data;
  },

  leaveGroup: async (groupId: string, userId: number) => {
    await apiClient.delete(`/groups/${groupId}`, { data: { userId } });
  },
};

export const userApi = {
  getUser: async (userId: number) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateCurrency: async (userId: number, amount: number) => {
    const response = await apiClient.patch(`/users/${userId}/currency`, { amount });
    return response.data;
  },
}; 