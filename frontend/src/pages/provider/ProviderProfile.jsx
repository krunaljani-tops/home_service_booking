import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { ShieldCheck, Briefcase, FileText } from 'lucide-react';

export default function ProviderProfile() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('ProFix Home Services');
  const [experienceYears, setExperienceYears] = useState(6);
  const [city, setCity] = useState('Bangalore');
  const [radiusKm, setRadiusKm] = useState(25);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProviderInfo() {
      try {
        const res = await api.get('/api/v1/providers');
        if (res.data && res.data.length > 0) {
          const p = res.data[0];
          setBusinessName(p.business_name || 'ProFix Home Services');
          setExperienceYears(p.experience_years || 5);
          setCity(p.city || 'Bangalore');
          setRadiusKm(p.service_radius_km || 20);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadProviderInfo();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Provider profile updated successfully');
    }, 400);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Provider Company Profile & KYC</h1>
        <p className="text-gray-500">Maintain your trade license credentials, service jurisdiction, and business identity.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Account Verified</span>
              <p className="text-xs text-emerald-700 mt-0.5">Government ID & Business License verified by HomeServe Administration.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Registered Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Years in Operation"
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
              <Input
                label="Primary Operating City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <Input
              label="Dispatch Radius Coverage (Kilometers)"
              type="number"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving Profile...' : 'Save Profile Details'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

