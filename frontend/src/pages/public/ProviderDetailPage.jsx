import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StarRating from '../../components/ui/StarRating';
import { mockProviders, mockServices, mockReviews } from '../../utils/mockData';

export const ProviderDetailPage = () => {
  const { id } = useParams();
  const provider = mockProviders.find((p) => p.id === id) || mockProviders[0];
  const [selectedDate, setSelectedDate] = useState('2026-11-06');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 12:00 PM');

  const availableSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/services" className="hover:text-slate-800">Providers</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 truncate max-w-xs">{provider.companyName}</span>
      </div>

      {/* Cover and Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-48 sm:h-64 w-full bg-slate-800 overflow-hidden relative">
          <img
            src={provider.coverImage}
            alt={provider.companyName}
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex items-end gap-4">
            <img
              src={provider.avatar}
              alt={provider.companyName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                {provider.companyName}
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {provider.address}
              </p>
              <div className="pt-1 flex items-center gap-3">
                <StarRating rating={provider.rating} showCount reviewCount={provider.reviewsCount} />
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-700">{provider.completedJobs}+ Completed Jobs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/customer/book?providerId=${provider.id}`}>
              <Button variant="primary" size="lg">
                Book Provider
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="About Company">
            <p className="text-sm text-slate-600 leading-relaxed">{provider.bio}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Experience</span>
                <span className="font-bold text-slate-900 text-sm">{provider.experienceYears} Years Active</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Compliance</span>
                <span className="font-bold text-emerald-600 text-sm">Police & ID Verified</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Service Response</span>
                <span className="font-bold text-indigo-600 text-sm">Under 60 Mins</span>
              </div>
            </div>
          </Card>

          {/* Services Provided */}
          <Card title="Services Offered by this Provider">
            <div className="space-y-3">
              {mockServices.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                    <span className="text-xs text-slate-400">{s.durationMinutes} mins • {s.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-slate-900">${s.price}</span>
                    <Link to={`/customer/book?serviceId=${s.id}&providerId=${provider.id}`}>
                      <Button variant="outline" size="sm">
                        Book
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Reviews */}
          <Card title="Verified Customer Feedback">
            <div className="space-y-4">
              {mockReviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{r.author}</span>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                  <StarRating rating={r.rating} size="sm" />
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Availability Picker */}
        <div className="space-y-6">
          <Card title="Schedule & Availability">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5 uppercase">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5 uppercase">
                  Available Arrival Slots
                </label>
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-2.5 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-colors ${
                        selectedSlot === slot
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to={`/customer/book?providerId=${provider.id}&date=${selectedDate}&slot=${encodeURIComponent(
                  selectedSlot
                )}`}
                className="block pt-2"
              >
                <Button variant="primary" className="w-full">
                  Continue to Booking
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
