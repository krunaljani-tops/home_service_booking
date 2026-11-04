import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { DollarSign, ArrowUpRight, Calendar, CheckCircle } from 'lucide-react';

export default function ProviderEarnings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/api/v1/bookings');
        setBookings(res.data?.items || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalGross = bookings.reduce((sum, b) => sum + (Number(b.final_amount) || 0), 0);
  const netEarnings = (totalGross * 0.85).toFixed(2);
  const platformFee = (totalGross * 0.15).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings & Settlements</h1>
        <p className="text-gray-500">Monitor your service revenues, commission deductions, and weekly payout transfers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Net Provider Payout</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mt-3">₹{netEarnings}</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4" /> Ready for weekly bank deposit
          </span>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Gross Merchandise Volume</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mt-3">₹{totalGross.toFixed(2)}</div>
          <span className="text-xs text-gray-500 mt-2 block">Total billed across completed services</span>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Platform Commission (15%)</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mt-3">₹{platformFee}</div>
          <span className="text-xs text-gray-500 mt-2 block">Includes payment gateway fee & GST</span>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Completed Bookings Settlement Breakdown</h3>
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : bookings.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">No settled bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Service Date</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Platform Fee (15%)</th>
                  <th className="py-3 px-4">Your Net Earning</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => {
                  const gross = Number(b.final_amount) || 0;
                  const fee = (gross * 0.15).toFixed(2);
                  const net = (gross * 0.85).toFixed(2);
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{b.booking_uid}</td>
                      <td className="py-3 px-4 text-gray-600">{b.scheduled_date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">₹{gross}</td>
                      <td className="py-3 px-4 text-amber-600">-₹{fee}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">₹{net}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
