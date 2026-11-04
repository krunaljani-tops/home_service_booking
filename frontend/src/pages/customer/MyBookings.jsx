import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Eye } from 'lucide-react';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await bookingService.getBookings();
        setBookings(res.items || res || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    if (filter === 'ACTIVE') return ['PENDING', 'CONFIRMED', 'PROVIDER_ASSIGNED', 'IN_PROGRESS'].includes(b.status);
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    if (filter === 'CANCELLED') return ['CANCELLED', 'REJECTED'].includes(b.status);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500">Track all your home service requests and history.</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === tab ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="font-semibold text-gray-700">No bookings match the filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((b) => (
              <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{b.booking_uid}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-gray-600">Scheduled Date: {b.scheduled_date} at {b.scheduled_time}</p>
                  {b.description && <p className="text-xs text-gray-400 italic">"{b.description}"</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-indigo-700">₹{b.final_amount}</span>
                  <Link to={`/customer/bookings/${b.id}`}>
                    <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

