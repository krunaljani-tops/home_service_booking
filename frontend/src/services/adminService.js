import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/api/v1/admin/dashboard/stats');
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get('/api/v1/admin/users', { params });
    return response.data;
  },

  async updateUser(id, data) {
    const response = await api.put(`/api/v1/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/api/v1/admin/users/${id}`);
    return response.data;
  },

  async verifyProvider(id, data) {
    const response = await api.post(`/api/v1/admin/providers/${id}/verify`, data);
    return response.data;
  },

  async getComplaints(params = {}) {
    const response = await api.get('/api/v1/complaints', { params });
    return response.data;
  },

  async updateComplaint(id, data) {
    const response = await api.patch(`/api/v1/complaints/${id}`, data);
    return response.data;
  },

  async getCoupons(params = {}) {
    const response = await api.get('/api/v1/coupons', { params });
    return response.data;
  },

  async createCoupon(data) {
    const response = await api.post('/api/v1/coupons', data);
    return response.data;
  },

  async deleteCoupon(id) {
    const response = await api.delete(`/api/v1/coupons/${id}`);
    return response.data;
  },

  async getReports(type = 'revenue', params = {}) {
    const response = await api.get(`/api/v1/admin/reports/${type}`, { params });
    return response.data;
  },

  async exportCSV(type = 'revenue') {
    const response = await api.get(`/api/v1/admin/reports/${type}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/api/v1/admin/settings');
    return response.data;
  },

  async updateSettings(data) {
    const response = await api.put('/api/v1/admin/settings', data);
    return response.data;
  },
};

export default adminService;
