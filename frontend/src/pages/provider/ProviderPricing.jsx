import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { DollarSign, ShieldCheck } from 'lucide-react';

export default function ProviderPricing() {
  const [hourlyRate, setHourlyRate] = useState(349);
  const [visitFee, setVisitFee] = useState(99);
  const [emergencySurcharge, setEmergencySurcharge] = useState(150);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Custom pricing rules updated successfully');
    }, 400);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Pricing & Rate Card</h1>
        <p className="text-gray-500">Configure your base labor rates, visitation fees, and emergency callout markups.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Standard Hourly Labor Rate (₹)"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
            />
            <Input
              label="Diagnostic / Inspection Visiting Fee (₹)"
              type="number"
              value={visitFee}
              onChange={(e) => setVisitFee(e.target.value)}
              required
            />
            <Input
              label="Emergency / Weekend Surcharge (₹)"
              type="number"
              value={emergencySurcharge}
              onChange={(e) => setEmergencySurcharge(e.target.value)}
              required
            />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-900">
              <span className="font-bold">Transparent Platform Commission:</span>
              <p className="mt-0.5">HomeServe retains a standard 15% platform facilitation fee on completed bookings. Net proceeds are automatically transferred to your bank account weekly.</p>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Updating Rates...' : 'Save Pricing Card'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
