import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import StarRating from '../../components/ui/StarRating';
import { mockServices, mockCategories } from '../../utils/mockData';

export const ServiceManagement = () => {
  const [services, setServices] = useState(mockServices);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOpenModal = (srv = null) => {
    setEditingService(srv);
    if (srv) {
      setValue('name', srv.name);
      setValue('categoryId', srv.categoryId);
      setValue('price', srv.price);
      setValue('durationMinutes', srv.durationMinutes);
      setValue('description', srv.description);
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const category = mockCategories.find((c) => c.id === data.categoryId);
    const catName = category ? category.name : 'General';

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                ...data,
                categoryName: catName,
                price: Number(data.price),
                durationMinutes: Number(data.durationMinutes),
              }
            : s
        )
      );
      toast.success('Service package updated');
    } else {
      const newSrv = {
        id: 'srv_' + Date.now(),
        ...data,
        categoryName: catName,
        price: Number(data.price),
        durationMinutes: Number(data.durationMinutes),
        rating: 5.0,
        reviewCount: 0,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      };
      setServices((prev) => [...prev, newSrv]);
      toast.success('New service created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Service deleted');
    }
  };

  const filtered = services.filter((s) => {
    const matchCat = selectedCat === 'all' || s.categoryId === selectedCat;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const columns = [
    {
      key: 'name',
      title: 'Service Name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-[11px] text-slate-400">{row.categoryName}</span>
        </div>
      ),
    },
    { key: 'durationMinutes', title: 'Est. Duration', render: (val) => `${val} mins` },
    { key: 'price', title: 'Fixed Rate', render: (val) => <span className="font-bold">${val}</span> },
    {
      key: 'rating',
      title: 'Rating',
      render: (val, row) => <StarRating rating={val} size="sm" showCount reviewCount={row.reviewCount} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Edit2} onClick={() => handleOpenModal(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage standard offerings, time estimations, and prices.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal(null)}>
          Add Service
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table columns={columns} data={filtered} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service Offering'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Service Title"
            placeholder="e.g. Tankless Water Heater Descaling"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />

          <Select
            label="Category"
            {...register('categoryId', { required: 'Category is required' })}
            error={errors.categoryId?.message}
          >
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Standard Rate ($)"
              type="number"
              placeholder="69"
              {...register('price', { required: 'Price is required' })}
              error={errors.price?.message}
            />
            <Input
              label="Est Duration (Mins)"
              type="number"
              placeholder="60"
              {...register('durationMinutes', { required: 'Duration is required' })}
              error={errors.durationMinutes?.message}
            />
          </div>

          <Textarea
            label="Description & Scope"
            rows={3}
            placeholder="Detailed description of what the technician will execute..."
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingService ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
