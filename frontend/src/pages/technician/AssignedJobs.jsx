import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { Check, Play, Navigation, CheckCircle } from 'lucide-react';

export default function AssignedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await bookingService.getBookings();
      setJobs(res.items || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const advanceStatus = async (id, currentStatus) => {
    let nextStatus = 'IN_PROGRESS';
    if (currentStatus === 'PROVIDER_ASSIGNED') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';

    try {
      await bookingService.updateBookingStatus(id, nextStatus);
      toast.success(`Job updated to ${nextStatus}!`);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Status update failed");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assigned Jobs & Visits</h1>
        <p className="text-gray-500">Track client location, mark arrival, and report completion status.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : jobs.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No jobs currently assigned</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map(j => (
              <div key={j.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{j.booking_uid}</span>
                    <StatusBadge status={j.status} />
                  </div>
                  <p className="text-sm text-gray-600">Time: {j.scheduled_date} @ {j.scheduled_time}</p>
                  {j.description && <p className="text-xs text-gray-500 italic">{j.description}</p>}
                </div>
                <div>
                  {['CONFIRMED', 'PROVIDER_ASSIGNED'].includes(j.status) && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Play className="w-4 h-4" />}
                      onClick={() => advanceStatus(j.id, j.status)}
                    >
                      Start Service
                    </Button>
                  )}
                  {j.status === 'IN_PROGRESS' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => advanceStatus(j.id, j.status)}
                    >
                      Mark Completed
                    </Button>
                  )}
                  {j.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      Job Completed ✓
                    </span>
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

