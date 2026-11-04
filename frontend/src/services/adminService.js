import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/api/v1/reports/dashboard');
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get('/api/v1/users', { params });
    return response.data;
  },

  async updateUser(id, data) {
    const response = await api.patch(`/api/v1/users/${id}/status`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  },

  async verifyProvider(id, data) {
    const response = await api.post(`/api/v1/providers/${id}/verify`, data);
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
    const response = await api.get(`/api/v1/reports/${type}`, { params });
    return response.data;
  },

  async exportCSV(type = 'revenue') {
    const response = await api.get(`/api/v1/reports/export/csv`, {
      params: { report_type: type },
      responseType: 'blob',
    });
    return response.data;
  },

  async getSettings() {
    return {
      platformCommission: 15,
      taxRate: 18,
      supportEmail: 'support@homeserve.in',
      supportPhone: '+91 98765 43210',
      maintenanceMode: false,
    };
  },

  async updateSettings(data) {
    return data;
  },
};

export default adminService;
