import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await bookingService.getBookings({ limit: 5 });
        setBookings(res.items || res || []);
      } catch (err) {
        console.error("Failed to load customer bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeCount = bookings.filter(b => ['PENDING', 'CONFIRMED', 'PROVIDER_ASSIGNED', 'IN_PROGRESS'].includes(b.status)).length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || 'Customer'}!</h1>
          <p className="text-gray-500">Manage your active service bookings and explore top-rated professionals.</p>
        </div>
        <Link to="/customer/browse">
          <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>Book New Service</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Active Bookings</p>
              <h3 className="text-3xl font-extrabold text-indigo-950 mt-1">{activeCount}</h3>
            </div>
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Completed Services</p>
              <h3 className="text-3xl font-extrabold text-emerald-950 mt-1">{completedCount}</h3>
            </div>
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Saved Addresses</p>
              <h3 className="text-3xl font-extrabold text-purple-950 mt-1">Active</h3>
            </div>
            <div className="p-3 bg-purple-600 text-white rounded-xl shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Service Bookings</h2>
          <Link to="/customer/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="font-semibold text-gray-700">No bookings yet</p>
            <p className="text-sm mt-1">Explore our wide selection of services to schedule your first appointment.</p>
            <Link to="/customer/browse" className="inline-block mt-4">
              <Button variant="outline">Browse Services</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <div key={booking.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{booking.booking_uid}</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Scheduled: {booking.scheduled_date} at {booking.scheduled_time}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">₹{booking.final_amount}</span>
                  <Link to={`/customer/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm">Details</Button>
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

