import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [platformCommission, setPlatformCommission] = useState(15);
  const [taxRate, setTaxRate] = useState(18);
  const [supportEmail, setSupportEmail] = useState('support@homeserve.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Platform configuration saved successfully');
    }, 500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500">Configure marketplace commission rates, tax policies, and support channels.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Financial & Commission Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Platform Take Rate / Commission (%)"
                type="number"
                value={platformCommission}
                onChange={(e) => setPlatformCommission(e.target.value)}
                min="0"
                max="50"
              />
              <Input
                label="Standard GST / Tax Rate (%)"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                min="0"
                max="30"
              />
            </div>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Support Coordinates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Support Email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
              <Input
                label="Support Helpline Phone"
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">System Maintenance Mode</div>
              <div className="text-xs text-gray-500">When enabled, only administrators can sign in to the platform.</div>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
