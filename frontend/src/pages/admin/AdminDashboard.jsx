import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { mockBookings, mockComplaints } from '../../utils/mockData';

export const AdminDashboard = () => {
  const revenueData = [
    { name: 'Mon', revenue: 4200, bookings: 38 },
    { name: 'Tue', revenue: 5800, bookings: 52 },
    { name: 'Wed', revenue: 6400, bookings: 61 },
    { name: 'Thu', revenue: 5100, bookings: 49 },
    { name: 'Fri', revenue: 7900, bookings: 78 },
    { name: 'Sat', revenue: 9800, bookings: 94 },
    { name: 'Sun', revenue: 8600, bookings: 82 },
  ];

  const statusDistribution = [
    { name: 'Completed', value: 450, color: '#10b981' },
    { name: 'In Progress', value: 85, color: '#8b5cf6' },
    { name: 'Confirmed', value: 120, color: '#3b82f6' },
    { name: 'Pending', value: 42, color: '#f59e0b' },
    { name: 'Cancelled', value: 24, color: '#f43f5e' },
  ];

  const bookingColumns = [
    { key: 'id', title: 'Booking ID', render: (val) => <span className="font-bold text-indigo-600">{val}</span> },
    { key: 'customerName', title: 'Customer' },
    { key: 'serviceTitle', title: 'Service', render: (val) => <span className="truncate max-w-[180px] block">{val}</span> },
    { key: 'providerName', title: 'Provider' },
    { key: 'status', title: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'amount', title: 'Amount', render: (val) => <span className="font-bold">${val}</span> },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Platform Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time metrics, booking velocity, and system health.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Gross Revenue"
          value="$47,800"
          change="+18.4%"
          trend="up"
          icon={DollarSign}
          iconColor="emerald"
        />
        <StatCard
          title="Total Bookings"
          value="721"
          change="+12.2%"
          trend="up"
          icon={CalendarCheck}
          iconColor="indigo"
        />
        <StatCard
          title="Active Customers"
          value="3,480"
          change="+8.9%"
          trend="up"
          icon={Users}
          iconColor="purple"
        />
        <StatCard
          title="Verified Providers"
          value="148"
          change="+4 this week"
          trend="up"
          icon={Briefcase}
          iconColor="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2">
          <Card
            title="Weekly Revenue Velocity"
            subtitle="Platform gross merchandise value past 7 days"
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(val) => [`$${val}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Booking Distribution Pie */}
        <div>
          <Card
            title="Booking Status Ratio"
            subtitle="Current cycle distribution"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Bookings & Pending Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Platform Bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <Table columns={bookingColumns} data={mockBookings.slice(0, 4)} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Complaints</h3>
            <Link to="/admin/complaints" className="text-xs font-semibold text-indigo-600 hover:underline">
              Resolve
            </Link>
          </div>
          <div className="space-y-3">
            {mockComplaints.map((c) => (
              <div key={c.id} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.id}</span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <p className="text-xs font-semibold text-slate-800">{c.subject}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
