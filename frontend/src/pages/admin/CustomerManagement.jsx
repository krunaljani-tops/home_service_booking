import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, UserPlus, MoreVertical, Edit2, Ban, CheckCircle, Eye } from 'lucide-react';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';

export const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customers, setCustomers] = useState([
    {
      id: 'cust_101',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 902-3344',
      bookingsCount: 6,
      totalSpent: 410,
      status: 'active',
      joinedDate: '2026-02-14',
    },
    {
      id: 'cust_102',
      name: 'Sophia Chen',
      email: 'sophia.c@example.com',
      phone: '+1 (555) 345-7766',
      bookingsCount: 3,
      totalSpent: 320,
      status: 'active',
      joinedDate: '2026-05-20',
    },
    {
      id: 'cust_103',
      name: 'Johnathan Miller',
      email: 'j.miller@example.com',
      phone: '+1 (555) 890-4455',
      bookingsCount: 1,
      totalSpent: 79,
      status: 'active',
      joinedDate: '2026-08-11',
    },
    {
      id: 'cust_104',
      name: 'David Kim',
      email: 'dkim@example.com',
      phone: '+1 (555) 234-9988',
      bookingsCount: 4,
      totalSpent: 260,
      status: 'suspended',
      joinedDate: '2026-01-05',
    },
  ]);

  const toggleStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === 'active' ? 'suspended' : 'active';
          toast.success(`Customer ${c.name} is now ${next}`);
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      key: 'name',
      title: 'Customer Name',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{val}</span>
          <span className="text-[11px] text-slate-400">ID: {row.id}</span>
        </div>
      ),
    },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'bookingsCount', title: 'Bookings', render: (val) => `${val} jobs` },
    { key: 'totalSpent', title: 'Lifetime Spend', render: (val) => `$${val}` },
    { key: 'status', title: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCustomer(row);
              setIsModalOpen(true);
            }}
          >
            View / Edit
          </Button>
          <Button
            variant={row.status === 'active' ? 'danger' : 'success'}
            size="sm"
            onClick={() => toggleStatus(row.id)}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-xs text-slate-500 mt-1">View, inspect, or manage registered homeowners.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filtered} />
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} />

      {/* Details/Edit Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Customer: ${selectedCustomer.name}`}
          description={`Registered ID: ${selectedCustomer.id}`}
        >
          <div className="space-y-4">
            <Input label="Name" defaultValue={selectedCustomer.name} />
            <Input label="Email" defaultValue={selectedCustomer.email} />
            <Input label="Phone" defaultValue={selectedCustomer.phone} />
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 block">Total Bookings</span>
                <span className="font-bold text-slate-800">{selectedCustomer.bookingsCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lifetime Spend</span>
                <span className="font-bold text-slate-800">${selectedCustomer.totalSpent}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success('Customer details updated');
                  setIsModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerManagement;
