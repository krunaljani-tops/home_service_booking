import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export default function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await api.get('/api/v1/payments');
        setPayments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500">Track all paid charges, transaction IDs, and refund statuses.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No payment records</h3>
            <p className="text-xs text-gray-500 mt-1">Payments made for completed bookings will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-900">
                      {p.transaction_id || `TXN-HS-${p.id}`}
                    </td>
                    <td className="py-3 px-4 text-gray-600">Booking #{p.booking_id}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">₹{p.amount}</td>
                    <td className="py-3 px-4 uppercase text-xs text-gray-500">{p.payment_method || 'CARD/UPI'}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A'}
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

