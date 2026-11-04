import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, CheckCircle } from 'lucide-react';
import serviceService from '../../services/serviceService';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BookService() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preServiceId = searchParams.get('service_id');
  const preProviderId = searchParams.get('provider_id');

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [serviceId, setServiceId] = useState(preServiceId || '');
  const [providerId, setProviderId] = useState(preProviderId || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [postalCode, setPostalCode] = useState('400001');
  const [description, setDescription] = useState('');
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    async function loadOptions() {
      try {
        const [sRes, pRes] = await Promise.allSettled([
          serviceService.getServices({ limit: 50 }),
          serviceService.getProviders({ limit: 50 }),
        ]);

        const sItems = sRes.status === 'fulfilled' ? (sRes.value.items || sRes.value || []) : [];
        const pItems = pRes.status === 'fulfilled' ? (pRes.value.items || pRes.value || []) : [];

        setServices(sItems);
        setProviders(pItems);

        // Pre-select or select first option
        if (preServiceId) {
          setServiceId(String(preServiceId));
        } else if (sItems.length > 0) {
          setServiceId(String(sItems[0].id));
        }

        if (preProviderId) {
          setProviderId(String(preProviderId));
        } else if (pItems.length > 0) {
          setProviderId(String(pItems[0].id));
        }
      } catch (err) {
        console.error('Failed to load booking options', err);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please pick a scheduled date and time");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        provider_id: parseInt(providerId),
        service_id: parseInt(serviceId),
        address_id: 1, // Fallback default seed address or first created
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime + ":00",
        duration_minutes: 60,
        description: description,
        coupon_code: couponCode ? couponCode.trim() : null,
      };
      const res = await bookingService.createBooking(payload);
      toast.success("Service booked successfully!");
      navigate(`/customer/bookings/${res.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule a Home Service</h1>
        <p className="text-gray-500">Pick an experienced service provider and convenient appointment slot.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
              required
            >
              <option value="" disabled>Select a service...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} - ₹{s.base_price}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service Provider</label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
              required
            >
              <option value="" disabled>Select a provider...</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.company_name} (Rating: {p.rating_avg || '5.0'} ★)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Scheduled Date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
              <select
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
              >
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:30">05:30 PM</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Service Instructions / Problem Notes"
            placeholder="Describe specific issues, appliances, or rooms..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <Input
            label="Discount Coupon Code"
            placeholder="e.g. WELCOME20, CLEAN15"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          <div className="pt-4 border-t">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={submitting}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              {submitting ? 'Confirming Booking...' : 'Confirm & Schedule Booking'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

