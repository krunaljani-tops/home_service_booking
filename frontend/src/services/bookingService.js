import api from './api';

export const bookingService = {
  async getBookings(params = {}) {
    const response = await api.get('/api/v1/bookings', { params });
    return response.data;
  },

  async getBooking(id) {
    const response = await api.get(`/api/v1/bookings/${id}`);
    return response.data;
  },

  async createBooking(data) {
    const response = await api.post('/api/v1/bookings', data);
    return response.data;
  },

  async updateBookingStatus(id, status, notes = '') {
    const response = await api.patch(`/api/v1/bookings/${id}/status`, { status, notes });
    return response.data;
  },

  async cancelBooking(id, reason = '') {
    const response = await api.post(`/api/v1/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  async assignTechnician(bookingId, technicianId) {
    const response = await api.post(`/api/v1/bookings/${bookingId}/assign`, { technician_id: technicianId });
    return response.data;
  },

  async uploadBookingImages(bookingId, files) {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append('images', file));
    } else {
      formData.append('images', files);
    }
    const response = await api.post(`/api/v1/bookings/${bookingId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default bookingService;
