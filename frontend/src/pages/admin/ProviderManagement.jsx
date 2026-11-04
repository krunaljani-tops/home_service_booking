import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, ShieldCheck, CheckCircle2, XCircle, Eye } from 'lucide-react';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import Pagination from '../../components/ui/Pagination';
import { mockProviders } from '../../utils/mockData';

export const ProviderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const [providers, setProviders] = useState([
    ...mockProviders,
    {
      id: 'prov_4',
      companyName: 'Titan HVAC Solutions',
      ownerName: 'Frank Underwood',
      email: 'frank@titanhvac.com',
      phone: '+1 (555) 777-2233',
      rating: 4.6,
      reviewsCount: 18,
      completedJobs: 42,
      verified: false,
      status: 'pending',
      address: '900 Broadway, New York, NY',
      experienceYears: 4,
      services: ['AC Servicing'],
    },
  ]);

  const toggleVerification = (id, newStatus) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          toast.success(`Provider status updated to ${newStatus}`);
          return { ...p, verified: newStatus === 'approved', status: newStatus };
        }
        return p;
      })
    );
  };

  const filtered = providers.filter((p) => {
    const matchSearch =
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'verified'
        ? p.verified
        : !p.verified;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      key: 'companyName',
      title: 'Company',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-[11px] text-slate-400">Owner: {row.ownerName}</span>
        </div>
      ),
    },
    { key: 'email', title: 'Contact' },
    {
      key: 'verified',
      title: 'Verification',
      render: (val) => (
        <StatusBadge status={val ? 'verified' : 'pending'} />
      ),
    },
    {
      key: 'rating',
      title: 'Rating / Jobs',
      render: (val, row) => (
        <div className="text-xs">
          <StarRating rating={val} size="sm" showCount reviewCount={row.reviewsCount} />
          <span className="text-slate-400 block text-[10px] mt-0.5">{row.completedJobs} jobs</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Verification Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/providers/${row.id}/verify`}>
            <Button variant="outline" size="sm" icon={Eye}>
              Review Docs
            </Button>
          </Link>
          {!row.verified ? (
            <Button
              variant="success"
              size="sm"
              onClick={() => toggleVerification(row.id, 'approved')}
            >
              Approve
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={() => toggleVerification(row.id, 'rejected')}
            >
              Revoke
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Provider Partners</h1>
          <p className="text-xs text-slate-500 mt-1">
            Vetting, trade license approvals, and enterprise partner management.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provider company or owner..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Providers</option>
            <option value="verified">Verified</option>
            <option value="unverified">Pending Approval</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filtered} />
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} />
    </div>
  );
};

export default ProviderManagement;
