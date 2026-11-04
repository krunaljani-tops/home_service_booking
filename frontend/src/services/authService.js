import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data;
  },

  async register(data) {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/api/v1/auth/profile', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.post('/api/v1/auth/change-password', data);
    return response.data;
  },
};

export default authService;
