import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getBookings();
      setBookings(res.items || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      toast.success(`Booking status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-500">Accept or reject pending orders and manage active service appointments.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : bookings.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No bookings available</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{b.booking_uid}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-gray-600">Date: {b.scheduled_date} at {b.scheduled_time}</p>
                  {b.description && <p className="text-xs text-gray-400">"{b.description}"</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">₹{b.final_amount}</span>
                  {b.status === 'PENDING' && (
                    <>
                      <Button size="sm" variant="primary" onClick={() => handleStatus(b.id, 'CONFIRMED')}>
                        Accept
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleStatus(b.id, 'REJECTED')}>
                        Reject
                      </Button>
                    </>
                  )}
                  {b.status === 'CONFIRMED' && (
                    <Button size="sm" variant="secondary" onClick={() => handleStatus(b.id, 'PROVIDER_ASSIGNED')}>
                      Mark Assigned
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

