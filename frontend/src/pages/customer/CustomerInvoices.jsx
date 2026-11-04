import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await api.get('/api/v1/invoices');
        setInvoices(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const handleDownload = async (id, invoiceNumber) => {
    try {
      const res = await api.get(`/api/v1/invoices/${id}/download`);
      // Create printable window or download text/html
      const win = window.open('', '_blank');
      win.document.write(res.data || 'Invoice Details');
      win.document.close();
      toast.success(`Invoice ${invoiceNumber} opened`);
    } catch (err) {
      toast.error('Failed to download invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax Invoices</h1>
        <p className="text-gray-500">Official GST-compliant tax invoices for your completed service appointments.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No invoices issued</h3>
            <p className="text-xs text-gray-500 mt-1">Invoices are automatically generated once your booking service is completed and settled.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Base Amount</th>
                  <th className="py-3 px-4">GST (18%)</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Date Issued</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{inv.invoice_number}</td>
                    <td className="py-3 px-4 text-gray-600">Booking #{inv.booking_id}</td>
                    <td className="py-3 px-4 text-gray-600">₹{inv.base_amount || (inv.total_amount * 0.82).toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">₹{inv.tax_amount || (inv.total_amount * 0.18).toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600">₹{inv.total_amount}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Download}
                        onClick={() => handleDownload(inv.id, inv.invoice_number)}
                      >
                        PDF
                      </Button>
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
