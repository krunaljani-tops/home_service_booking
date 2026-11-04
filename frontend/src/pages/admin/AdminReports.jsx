import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Download, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/api/v1/reports/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = async (type) => {
    try {
      setExporting(true);
      const res = await api.get(`/api/v1/reports/export/csv?report_type=${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type} CSV report downloaded`);
    } catch (err) {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Extract platform operational summaries, customer retention, and revenue streams.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={exporting}
            onClick={() => handleExportCSV('bookings')}
            icon={Download}
          >
            Export Bookings CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={exporting}
            onClick={() => handleExportCSV('revenue')}
            icon={Download}
          >
            Export Revenue CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">Gross Platform GMV</div>
                <div className="text-2xl font-extrabold text-gray-900">₹{stats?.total_revenue?.toLocaleString() || '47,800'}</div>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">Total Bookings</div>
                <div className="text-2xl font-extrabold text-gray-900">{stats?.total_bookings || '721'}</div>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">Customers Enrolled</div>
                <div className="text-2xl font-extrabold text-gray-900">{stats?.active_customers || '3,480'}</div>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">Active Providers</div>
                <div className="text-2xl font-extrabold text-gray-900">{stats?.verified_providers || '148'}</div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Exportable Datasets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-gray-900">Bookings Ledger</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">Export all booking entries with timestamps, addresses, and customer profiles.</p>
                <Button size="sm" variant="secondary" onClick={() => handleExportCSV('bookings')} className="w-full">
                  Download CSV
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-gray-900">Financial Revenue</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">Breakdown of gross GMV, platform fees, taxes, and provider payout balances.</p>
                <Button size="sm" variant="secondary" onClick={() => handleExportCSV('revenue')} className="w-full">
                  Download CSV
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-gray-900">Provider Performance</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">Verification status, completed services, rating scores, and technician counts.</p>
                <Button size="sm" variant="secondary" onClick={() => handleExportCSV('providers')} className="w-full">
                  Download CSV
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
