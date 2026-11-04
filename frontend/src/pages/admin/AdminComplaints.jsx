import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/complaints');
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await api.patch(`/api/v1/complaints/${id}`, {
        status: newStatus,
        resolution_notes: `Marked as ${newStatus} by platform administrator`,
      });
      toast.success(`Complaint status updated to ${newStatus}`);
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update complaint');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Disputes</h1>
          <p className="text-gray-500">Review customer escalation tickets and resolve service conflicts.</p>
        </div>
        <Button variant="secondary" onClick={fetchComplaints}>Refresh</Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No open complaints reported.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Ticket UID</th>
                  <th className="py-3 px-4">Booking</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-900">{c.complaint_uid}</td>
                    <td className="py-3 px-4 text-gray-600">#{c.booking_id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{c.subject}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{c.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        c.priority === 'HIGH' || c.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {c.status !== 'RESOLVED' && (
                        <button
                          disabled={updatingId === c.id}
                          onClick={() => handleUpdateStatus(c.id, 'RESOLVED')}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Resolve
                        </button>
                      )}
                      {c.status === 'OPEN' && (
                        <button
                          disabled={updatingId === c.id}
                          onClick={() => handleUpdateStatus(c.id, 'IN_PROGRESS')}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100"
                        >
                          In Progress
                        </button>
                      )}
                    </td>
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

