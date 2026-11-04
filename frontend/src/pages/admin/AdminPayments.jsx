import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [refundingId, setRefundingId] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/api/v1/payments', { params });
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const handleRefund = async (id) => {
    if (!window.confirm('Are you sure you want to process a refund for this payment?')) return;
    try {
      setRefundingId(id);
      await api.post(`/api/v1/payments/${id}/refund`, {
        refund_reason: 'Admin approved refund',
      });
      toast.success('Refund processed successfully');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to refund payment');
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Transactions</h1>
          <p className="text-gray-500">Surveil all incoming transactions, escrow settlements, and refunds.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>
          <Button variant="secondary" onClick={fetchPayments}>Refresh</Button>
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : payments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Transaction UID</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-900">
                      {p.transaction_id || `TXN-${p.id}`}
                    </td>
                    <td className="py-3 px-4 text-gray-600">#{p.booking_id}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600">₹{p.amount}</td>
                    <td className="py-3 px-4 uppercase text-xs text-gray-500">{p.payment_method || 'CARD'}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status === 'SUCCESS' && (
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={refundingId === p.id}
                          onClick={() => handleRefund(p.id)}
                        >
                          {refundingId === p.id ? 'Refunding...' : 'Refund'}
                        </Button>
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
