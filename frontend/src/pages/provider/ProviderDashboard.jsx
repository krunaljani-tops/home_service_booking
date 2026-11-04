import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, DollarSign, Users, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await bookingService.getBookings({ limit: 10 });
        setBookings(res.items || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const pendingRequests = bookings.filter(b => b.status === 'PENDING').length;
  const inProgress = bookings.filter(b => ['CONFIRMED', 'PROVIDER_ASSIGNED', 'IN_PROGRESS'].includes(b.status)).length;
  const completed = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Operations Hub</h1>
          <p className="text-gray-500">Manage client requests, dispatch technicians, and track gross earnings.</p>
        </div>
        <Link to="/provider/requests">
          <Button variant="primary">Manage Incoming Requests ({pendingRequests})</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-gray-500">Pending Requests</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{pendingRequests}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-indigo-500">
          <p className="text-sm font-medium text-gray-500">In-Progress Orders</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{inProgress}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-gray-500">Completed Orders</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{completed}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-gray-500">Verification Status</p>
          <p className="text-xl font-bold text-emerald-600 mt-2">VERIFIED ✓</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Live Service Requests</h2>
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No requests currently active.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map(b => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{b.booking_uid}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Date: {b.scheduled_date} at {b.scheduled_time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">₹{b.final_amount}</span>
                  <Link to={`/provider/requests`}>
                    <Button variant="outline" size="sm">Review Action</Button>
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

