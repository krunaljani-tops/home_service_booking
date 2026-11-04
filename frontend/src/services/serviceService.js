import api from './api';

export const serviceService = {
  async getCategories() {
    const response = await api.get('/api/v1/categories');
    return response.data;
  },

  async getCategory(id) {
    const response = await api.get(`/api/v1/categories/${id}`);
    return response.data;
  },

  async getServices(params = {}) {
    const response = await api.get('/api/v1/services', { params });
    return response.data;
  },

  async getService(id) {
    const response = await api.get(`/api/v1/services/${id}`);
    return response.data;
  },

  async getProviders(params = {}) {
    const response = await api.get('/api/v1/providers', { params });
    return response.data;
  },

  async getProvider(id) {
    const response = await api.get(`/api/v1/providers/${id}`);
    return response.data;
  },

  async getProviderAvailability(providerId, date) {
    const response = await api.get(`/api/v1/providers/${providerId}/availability`, {
      params: { date },
    });
    return response.data;
  },
};

export default serviceService;
