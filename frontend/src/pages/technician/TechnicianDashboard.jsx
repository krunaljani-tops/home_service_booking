import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await bookingService.getBookings({ limit: 10 });
        setJobs(res.items || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs()
  }, []);

  const activeJobs = jobs.filter(j => ['PROVIDER_ASSIGNED', 'IN_PROGRESS'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Technician Workspace</h1>
        <p className="text-gray-500">Welcome, {user?.first_name || 'Technician'}. View your daily assigned service visits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 font-medium">Assigned Jobs</p>
              <h2 className="text-4xl font-extrabold mt-1">{activeJobs.length}</h2>
            </div>
            <Clock className="w-10 h-10 text-amber-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 font-medium">Completed Jobs</p>
              <h2 className="text-4xl font-extrabold mt-1">{completedJobs.length}</h2>
            </div>
            <CheckCircle className="w-10 h-10 text-emerald-200" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Assigned Service Queue</h2>
          <Link to="/technician/jobs">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assigned jobs currently found.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map(j => (
              <div key={j.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{j.booking_uid}</span>
                    <StatusBadge status={j.status} />
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {j.scheduled_date} at {j.scheduled_time}
                  </p>
                  {j.description && <p className="text-xs text-gray-500">Note: {j.description}</p>}
                </div>
                <Link to="/technician/jobs">
                  <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                    Update Status
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

