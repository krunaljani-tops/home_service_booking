import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { CheckCircle2, Calendar, MapPin } from 'lucide-react';

export default function TechnicianHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.get('/api/v1/bookings');
        const all = res.data?.items || res.data || [];
        // Completed or in-history jobs
        setJobs(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Completed Job Archive</h1>
        <p className="text-gray-500">Historical record of all serviced appointments, execution timestamps, and client sign-offs.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No completed jobs yet</h3>
            <p className="text-xs text-gray-500 mt-1">Jobs you finish and sign off with customer OTP will be stored in this archive.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Job UID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Job Value</th>
                  <th className="py-3 px-4">Resolution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{job.booking_uid}</td>
                    <td className="py-3 px-4 text-gray-600">{job.scheduled_date}</td>
                    <td className="py-3 px-4 text-gray-600">{job.scheduled_time}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">₹{job.final_amount}</td>
                    <td className="py-3 px-4"><StatusBadge status={job.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
