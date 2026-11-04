import api from './api';

export const paymentService = {
  async createOrder(bookingId) {
    const response = await api.post('/api/v1/payments/create-order', { booking_id: bookingId });
    return response.data;
  },

  async verifyPayment(data) {
    const response = await api.post('/api/v1/payments/verify', data);
    return response.data;
  },

  async getPayments(params = {}) {
    const response = await api.get('/api/v1/payments', { params });
    return response.data;
  },

  async getInvoices(params = {}) {
    const response = await api.get('/api/v1/payments/invoices', { params });
    return response.data;
  },

  async processRefund(paymentId, amount, reason) {
    const response = await api.post(`/api/v1/payments/${paymentId}/refund`, { amount, reason });
    return response.data;
  },
};

export default paymentService;
