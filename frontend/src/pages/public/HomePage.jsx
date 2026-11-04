import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Wrench,
  Zap,
  Sparkles,
  Fan,
  Hammer,
  PaintBucket,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Award,
  Users,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StarRating from '../../components/ui/StarRating';
import { mockCategories, mockProviders, mockReviews } from '../../utils/mockData';

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const categoryIcons = {
    plumbing: Wrench,
    electrical: Zap,
    cleaning: Sparkles,
    ac_repair: Fan,
    carpentry: Hammer,
    painting: PaintBucket,
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.25),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>The #1 Verified Home Services Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Certified Experts for Every Home Fix. <br />
            <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              On-Demand in 60 Minutes.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-indigo-100/90 leading-relaxed font-normal">
            From emergency plumbing and circuit repairs to deep house scrubbing and AC jet maintenance,
            book verified top-tier technicians with transparent pricing and warranty.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mt-8 bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center px-3 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plumbing, AC repair, electrical, deep cleaning..."
                className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto shadow-md"
            >
              Search Services
            </Button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-indigo-200">
            <span className="font-medium text-indigo-300">Popular:</span>
            {['Pipe Leaks', 'AC Jet Wash', 'Switchboard Repair', 'Deep Kitchen Clean', 'IKEA Assembly'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/services?q=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Value Badges */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <Clock className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Under 60 Mins</p>
                <p className="text-[10px] text-indigo-200">Rapid Arrival</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">100% Verified</p>
                <p className="text-[10px] text-indigo-200">Police & ID Checked</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <Award className="w-5 h-5 text-purple-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">30-Day Guarantee</p>
                <p className="text-[10px] text-indigo-200">Free rework warranty</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <Headphones className="w-5 h-5 text-sky-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">24/7 Support</p>
                <p className="text-[10px] text-indigo-200">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Our Core Service Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">Transparent upfront rates with zero surprise charges.</p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Wrench;
            return (
              <Link
                key={cat.id}
                to={`/services?cat=${cat.slug}`}
                className="group relative rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    From ${cat.startingPrice}
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>{cat.serviceCount} specific services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Simplicity</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How HomeServe Works in 3 Quick Steps
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Booking home maintenance has never been this frictionless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Service & Slot</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Choose from hundreds of standardized services, select your preferred date, time slot,
                and specify details or photos of the issue.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-purple-200">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Pro Arrives & Fixes</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A background-verified certified provider or technician arrives punctually with
                industrial tools and standard pricing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-emerald-200">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Pay Securely & Warranty</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Inspect the completed work, pay seamlessly online via cards or digital wallets,
                and enjoy an automatic 30-day rework warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Top Rated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Verified Service Providers
            </h2>
            <p className="text-sm text-slate-500 mt-1">Experienced teams with verified track records.</p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm">Explore All Providers</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProviders.map((prov) => (
            <Card key={prov.id} hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={prov.avatar}
                    alt={prov.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      {prov.companyName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </h3>
                    <p className="text-xs text-slate-400">{prov.address}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <StarRating rating={prov.rating} showCount reviewCount={prov.reviewsCount} />
                  <span className="font-semibold text-slate-700">{prov.completedJobs}+ jobs</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {prov.bio}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {prov.services.slice(0, 2).map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{prov.experienceYears} yrs experience</span>
                <Link to={`/providers/${prov.id}`}>
                  <Button variant="primary" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Loved by 50,000+ Homeowners</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-indigo-800/60 p-6 rounded-2xl border border-indigo-700/60 backdrop-blur-xs flex flex-col justify-between"
              >
                <div>
                  <StarRating rating={rev.rating} />
                  <p className="text-xs sm:text-sm text-indigo-100 mt-3 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{rev.author}</span>
                  <span className="text-indigo-300">{rev.serviceTitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to fix your home stress-free?
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-indigo-100">
              Join thousands of happy homeowners who rely on HomeServe Technologies for fast, verified,
              guaranteed service.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services">
                <Button variant="secondary" size="lg" className="text-indigo-900 font-bold">
                  Book a Service Now
                </Button>
              </Link>
              <Link to="/register?role=provider">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Register as a Service Provider
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
