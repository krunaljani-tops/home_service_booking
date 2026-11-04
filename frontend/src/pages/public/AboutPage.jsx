import React from 'react';
import { ShieldCheck, Target, HeartHandshake, Award, Users, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

export const AboutPage = () => {
  const stats = [
    { label: 'Verified Home Experts', value: '2,500+' },
    { label: 'Completed Bookings', value: '150,000+' },
    { label: 'Customer Satisfaction', value: '99.4%' },
    { label: 'Metro Cities Served', value: '24' },
  ];

  const team = [
    {
      name: 'Elena Rostova',
      role: 'Chief Executive Officer & Founder',
      bio: 'Former VP of Operations with 14 years scaling high-density logistics and residential services.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'Chief Technology Officer',
      bio: 'Architected high-throughput dispatch algorithms and automated quality assurance platforms.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Head of Quality & Compliance',
      bio: 'Former OSHA compliance officer overseeing our 7-tier technician vetting and background protocols.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">About HomeServe</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Setting the Gold Standard for On-Demand Home Services
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are eliminating the uncertainty, delays, and poor quality in home repairs by building
            a transparent, technology-driven platform powered by certified master technicians.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1 border-r last:border-none border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Origin</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              From Frustration to a National Platform
            </h2>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              Founded in 2023, HomeServe Technologies began after our founders experienced emergency
              pipe bursts and fraudulent repair quotes. We realized homeowners had no standardized,
              trusted way to book qualified technicians.
            </p>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Today, HomeServe empowers thousands of independent technicians and licensed service companies
              with cutting-edge dispatch software, while giving homeowners predictable pricing, transparent
              time-tracking, and an unconditional 30-day rework guarantee.
            </p>
          </div>

          <div className="bg-gradient-to-tr from-indigo-50 to-purple-50 p-6 sm:p-8 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Deliver effortless, reliable, and standardized home solutions with zero hassle.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Rigorous 7-Point Vetting</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Identity checks, criminal background verification, trade licenses, skill interviews,
                  and insurance bonding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Fair Wages & Empowerment</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Service providers keep up to 90% of their earnings with instant weekly payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Leadership</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Meet the Builders Behind HomeServe
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Industry veterans dedicated to modernizing household services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <Card key={idx} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-indigo-100 shadow-xs"
              />
              <h3 className="text-base font-bold text-slate-900 mt-4">{member.name}</h3>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{member.role}</p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
