import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AlertCircle, PlusCircle } from 'lucide-react';

export default function CustomerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    booking_id: '',
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/complaints');
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // Load customer's bookings for complaint dropdown
    api.get('/api/v1/bookings').then((res) => {
      setBookings(res.data?.items || res.data || []);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.booking_id) {
      toast.error('Please select a booking');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/api/v1/complaints', {
        ...formData,
        booking_id: Number(formData.booking_id),
      });
      toast.success('Complaint submitted. Support will investigate promptly.');
      setShowModal(false);
      setFormData({ booking_id: '', subject: '', description: '', priority: 'MEDIUM' });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Disputes</h1>
          <p className="text-gray-500">Raise issues regarding service quality, billing disputes, or technician misconduct.</p>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={() => setShowModal(true)}>
          Lodge Complaint
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No active complaints</h3>
            <p className="text-xs text-gray-500 mt-1">If you ever experience issues with your service, you can report them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-900">{c.complaint_uid}</span>
                      <StatusBadge status={c.status} />
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                        {c.priority} Priority
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mt-2">{c.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                    <div className="text-xs text-gray-400 mt-2">Relates to Booking #{c.booking_id}</div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {c.resolution_notes && (
                  <div className="mt-3 bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-emerald-800">
                    <span className="font-bold block mb-0.5">Admin Resolution:</span>
                    {c.resolution_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Lodge a Support Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Booking</label>
                <select
                  required
                  value={formData.booking_id}
                  onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="">-- Choose a booking --</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.booking_uid} - {b.scheduled_date} (₹{b.final_amount})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Complaint Subject"
                placeholder="e.g. Technician was 2 hours late"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Explain what went wrong in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
