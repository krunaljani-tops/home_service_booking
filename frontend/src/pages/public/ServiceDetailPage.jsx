import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StarRating from '../../components/ui/StarRating';
import { mockServices, mockProviders } from '../../utils/mockData';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = mockServices.find((s) => s.id === id) || mockServices[0];
  const eligibleProviders = mockProviders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/services" className="hover:text-slate-800">Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 truncate max-w-xs">{service.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="h-64 sm:h-80 w-full overflow-hidden bg-slate-100 relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 uppercase tracking-wider">
                {service.categoryName}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {service.name}
                </h1>
                <div className="flex items-center gap-3">
                  <StarRating rating={service.rating} showCount reviewCount={service.reviewCount} />
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Estimated: {service.durationMinutes} minutes
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  30-Day Free Rework Protection
                </span>
              </div>
            </div>
          </div>

          {/* What is Included */}
          <Card title="What is Included in This Service">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(service.includes || [
                'Full inspection & diagnostics',
                'Labor & service charges included',
                'Tools and safety gear provided',
                'Clean-up after service completion',
              ]).map((inc, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-700">{inc}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Verified Providers offering this service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Verified Providers Available for this Service
            </h3>
            <div className="space-y-3">
              {eligibleProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prov.avatar}
                      alt={prov.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {prov.companyName}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </h4>
                      <p className="text-xs text-slate-400">{prov.address}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={prov.rating} size="sm" showCount reviewCount={prov.reviewsCount} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link to={`/providers/${prov.id}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    <Link to={`/customer/book?serviceId=${service.id}&providerId=${prov.id}`}>
                      <Button variant="primary" size="sm">
                        Book Provider
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fixed Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">${service.price}</span>
                <span className="text-xs text-slate-500">all inclusive</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Standard Arrival Time</span>
                <span className="font-semibold text-slate-900">Within 60 mins</span>
              </div>
              <div className="flex justify-between">
                <span>Service Warranty</span>
                <span className="font-semibold text-emerald-600">30 Days</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation</span>
                <span className="font-semibold text-slate-900">Free before dispatch</span>
              </div>
            </div>

            <Link to={`/customer/book?serviceId=${service.id}`} className="block">
              <Button variant="primary" size="lg" className="w-full shadow-md font-bold">
                Book This Service
              </Button>
            </Link>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-700">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Use code <strong>HOMESERVE20</strong> at checkout for 20% discount.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
